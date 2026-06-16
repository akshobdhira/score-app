import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase'
import { getTemplate } from '@/lib/emailTemplates'
import { isValidOrigin } from '@/lib/rateLimit'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmailSchema = z.object({
  recipients: z.array(z.object({
    submissionId: z.string().uuid(),
    parentName: z.string().min(1),
    parentEmail: z.string().email(),
    grade: z.string().nullable().optional(),
  })).min(1),
  templateId: z.string().min(1),
  meetingLink: z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  if (!isValidOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = sendEmailSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const { recipients, templateId, meetingLink } = parsed.data
    const template = getTemplate(templateId)
    if (!template) {
      return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const results: { submissionId: string; status: 'sent' | 'failed'; error?: string }[] = []

    for (const recipient of recipients) {
      const html = template.html({
        parentName: recipient.parentName,
        grade: recipient.grade,
        meetingLink: meetingLink || undefined,
      })

      let status: 'sent' | 'failed' = 'sent'
      let errorMsg: string | undefined

      try {
        const { error } = await resend.emails.send({
          from: 'SCORE by New Age Parenting <onboarding@resend.dev>',
          to: [recipient.parentEmail],
          subject: template.subject,
          html,
        })

        if (error) {
          status = 'failed'
          errorMsg = error.message
        }
      } catch (err: unknown) {
        status = 'failed'
        errorMsg = err instanceof Error ? err.message : 'Unknown error'
      }

      // Log every attempt regardless of outcome
      await supabase.from('message_logs').insert({
        submission_id: recipient.submissionId,
        parent_name: recipient.parentName,
        parent_email: recipient.parentEmail,
        template_id: templateId,
        template_name: template.name,
        meeting_link: meetingLink || null,
        status,
        error: errorMsg ?? null,
      })

      results.push({ submissionId: recipient.submissionId, status, error: errorMsg })
    }

    const sentCount = results.filter((r) => r.status === 'sent').length
    const failedCount = results.filter((r) => r.status === 'failed').length

    return NextResponse.json({ results, sentCount, failedCount })
  } catch (err) {
    console.error('Send email error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
