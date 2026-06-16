export interface EmailTemplate {
  id: string
  name: string
  subject: string
  needsMeetingLink: boolean
  html: (params: { parentName: string; grade?: string | null; meetingLink?: string }) => string
}

const baseStyle = `
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #F5F7FA;
  margin: 0;
  padding: 0;
`

function wrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${baseStyle}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1A1A2E;padding:24px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:6px;">SCORE</span>
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:4px 0 0;">by New Age Parenting</p>
          </td>
        </tr>

        <!-- Body -->
        ${content}

        <!-- Footer -->
        <tr>
          <td style="background:#F5F7FA;padding:24px 32px;text-align:center;border-top:1px solid #E5E7EB;">
            <p style="color:#9CA3AF;font-size:12px;margin:0;">New Age Parenting · Empowering Parents, Shaping Futures</p>
            <p style="color:#9CA3AF;font-size:11px;margin:6px 0 0;">You received this because you took the SCORE Parenting Assessment.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function ctaButton(text: string, href: string) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
    <tr>
      <td align="center">
        <a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#E94560,#FF6B35);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ─── Template 1: Book Your Free Session ─────────────────────────────────────
  {
    id: 'book-session',
    name: 'Book Your Free Session',
    subject: 'Your SCORE results are ready — book your free session',
    needsMeetingLink: true,
    html: ({ parentName, grade, meetingLink = '#' }) => wrapper(`
      <tr>
        <td style="padding:40px 32px 32px;">
          <p style="color:#E94560;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">Your Results Are In</p>
          <h1 style="color:#1A1A2E;font-size:26px;font-weight:800;margin:0 0 16px;line-height:1.3;">
            Hi ${parentName}, your Parenting Score is waiting for you 🏆
          </h1>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            You recently completed the <strong>SCORE Parenting Assessment</strong>${grade ? ` for your child in <strong>${grade}</strong>` : ''}. Your personalised parenting profile is ready — and it has some insights that could genuinely change how you support your child's future.
          </p>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            We'd love to walk you through your results in a <strong>free 30-minute 1-on-1 session</strong> with our expert. No sales pitch — just a real conversation about your child's career readiness and what you can do right now.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF1F3;border-radius:12px;padding:0;margin:24px 0;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:#1A1A2E;font-size:14px;font-weight:700;margin:0 0 10px;">What you'll get in this session:</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">✅ &nbsp;A full breakdown of your SCORE profile</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">✅ &nbsp;Your child's biggest career readiness gaps</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">✅ &nbsp;3 actionable steps you can take this week</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">✅ &nbsp;100% free, no obligation</p>
              </td>
            </tr>
          </table>

          ${ctaButton('Book My Free Session →', meetingLink)}
          <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:12px 0 0;">Takes less than 30 seconds to pick a slot</p>
        </td>
      </tr>
    `),
  },

  // ─── Template 2: Follow-Up Nudge ────────────────────────────────────────────
  {
    id: 'follow-up',
    name: 'Follow-Up Nudge',
    subject: 'Still thinking about it? Your slot is still open',
    needsMeetingLink: true,
    html: ({ parentName, grade, meetingLink = '#' }) => wrapper(`
      <tr>
        <td style="padding:40px 32px 32px;">
          <p style="color:#E94560;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">Just Checking In</p>
          <h1 style="color:#1A1A2E;font-size:26px;font-weight:800;margin:0 0 16px;line-height:1.3;">
            Hi ${parentName}, your free session slot is still available 👋
          </h1>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            We reached out a few days ago about booking a free session to review your SCORE Parenting results${grade ? ` for your child in <strong>${grade}</strong>` : ''}. We know life gets busy — so we just wanted to check in.
          </p>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Parents who've had this conversation with us often say it was the <strong>most eye-opening 30 minutes</strong> they've spent on their child's future. It's completely free and there's no pressure.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-left:4px solid #E94560;padding:0;margin:24px 0;">
            <tr>
              <td style="padding:16px 20px;">
                <p style="color:#1A1A2E;font-size:14px;font-style:italic;line-height:1.7;margin:0;">
                  "I was hesitant at first, but this session completely changed how I think about my daughter's career preparation. Highly recommend."
                </p>
                <p style="color:#9CA3AF;font-size:13px;margin:8px 0 0;">— A parent from Delhi</p>
              </td>
            </tr>
          </table>

          ${ctaButton('Book My Free Session →', meetingLink)}
          <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:12px 0 0;">Slots are limited — pick a time that works for you</p>
        </td>
      </tr>
    `),
  },

  // ─── Template 3: Parenting Score Insights ───────────────────────────────────
  {
    id: 'insights',
    name: 'Your Parenting Score Insights',
    subject: '3 things most parents miss about career readiness',
    needsMeetingLink: false,
    html: ({ parentName, grade }) => wrapper(`
      <tr>
        <td style="padding:40px 32px 32px;">
          <p style="color:#E94560;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">Insights For You</p>
          <h1 style="color:#1A1A2E;font-size:26px;font-weight:800;margin:0 0 16px;line-height:1.3;">
            Hi ${parentName}, here's what your SCORE reveals 📊
          </h1>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Based on thousands of parents who've taken the SCORE assessment${grade ? `, parents of children in <strong>${grade}</strong> often face these common blind spots` : ''}:
          </p>

          <!-- Insight 1 -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;border-radius:12px;margin:0 0 16px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:#E94560;font-size:20px;margin:0 0 6px;">💬</p>
                <p style="color:#1A1A2E;font-size:15px;font-weight:700;margin:0 0 6px;">1. Communication gaps are the #1 issue</p>
                <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0;">
                  Most parents talk <em>at</em> their children about careers rather than <em>with</em> them. The result? Children stop sharing their real interests and just go along with parental expectations.
                </p>
              </td>
            </tr>
          </table>

          <!-- Insight 2 -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;border-radius:12px;margin:0 0 16px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:#E94560;font-size:20px;margin:0 0 6px;">🎯</p>
                <p style="color:#1A1A2E;font-size:15px;font-weight:700;margin:0 0 6px;">2. Exposure matters more than grades</p>
                <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0;">
                  Children who are exposed to diverse career paths before Grade 11 are 3x more likely to make confident, informed decisions. Most parents focus on grades but miss the exposure piece entirely.
                </p>
              </td>
            </tr>
          </table>

          <!-- Insight 3 -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;border-radius:12px;margin:0 0 24px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:#E94560;font-size:20px;margin:0 0 6px;">📅</p>
                <p style="color:#1A1A2E;font-size:15px;font-weight:700;margin:0 0 6px;">3. Planning starts earlier than you think</p>
                <p style="color:#4B5563;font-size:14px;line-height:1.6;margin:0;">
                  Financial and academic planning for higher education should ideally begin 3–4 years before Class 12. Most families start 6 months before — and then scramble.
                </p>
              </td>
            </tr>
          </table>

          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 0;">
            Want to know exactly where you stand on these? Your SCORE profile already has the answers. Book a free session and we'll walk you through it together.
          </p>

          ${ctaButton('Get My Personalised Breakdown →', 'https://score-app-rk.vercel.app/results')}
        </td>
      </tr>
    `),
  },

  // ─── Template 4: Limited Slots ───────────────────────────────────────────────
  {
    id: 'limited-slots',
    name: 'Limited Slots — Act Now',
    subject: '⚠️ Only a few free session slots left this month',
    needsMeetingLink: true,
    html: ({ parentName, grade, meetingLink = '#' }) => wrapper(`
      <tr>
        <td style="padding:40px 32px 32px;">

          <!-- Urgency banner -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF1F3;border:1px solid #FECDD3;border-radius:12px;margin:0 0 28px;">
            <tr>
              <td style="padding:14px 20px;text-align:center;">
                <p style="color:#E94560;font-size:14px;font-weight:700;margin:0;">⚠️ &nbsp;Only a few slots remaining this month</p>
              </td>
            </tr>
          </table>

          <p style="color:#E94560;font-size:13px;font-weight:700;letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">Last Chance</p>
          <h1 style="color:#1A1A2E;font-size:26px;font-weight:800;margin:0 0 16px;line-height:1.3;">
            Hi ${parentName}, this month's free sessions are filling up fast 🗓️
          </h1>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 16px;">
            We've been offering free 1-on-1 sessions to parents who took the SCORE Assessment${grade ? ` — and for parents of children in <strong>${grade}</strong>, this is especially time-sensitive` : ''}. Demand has been high and we're almost at capacity for this month.
          </p>
          <p style="color:#4B5563;font-size:15px;line-height:1.7;margin:0 0 24px;">
            In this session, our expert will review your personal SCORE profile and give you a clear, actionable plan — tailored to exactly where your child is right now.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;border-radius:12px;margin:0 0 8px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="color:#1A1A2E;font-size:14px;font-weight:700;margin:0 0 12px;">Why parents are grabbing these slots:</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">🎯 &nbsp;Personalised guidance — not generic advice</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">⏱️ &nbsp;Just 30 minutes, completely free</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">📊 &nbsp;Based on your actual SCORE assessment data</p>
                <p style="color:#4B5563;font-size:14px;margin:4px 0;">🔒 &nbsp;No obligation, no sales pressure</p>
              </td>
            </tr>
          </table>

          ${ctaButton('Grab My Slot Before It\'s Gone →', meetingLink)}
          <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:12px 0 0;">Once slots are filled, next availability is next month</p>
        </td>
      </tr>
    `),
  },
]

export function getTemplate(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === id)
}
