'use client'

// NOTE: recharts is NOT yet installed. Run: npm install recharts
// After installing, the RadarChart will render correctly.

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import recharts to avoid SSR issues
const RadarChart = dynamic(
  () => import('recharts').then((mod) => mod.RadarChart),
  { ssr: false }
)
const Radar = dynamic(
  () => import('recharts').then((mod) => mod.Radar),
  { ssr: false }
)
const PolarGrid = dynamic(
  () => import('recharts').then((mod) => mod.PolarGrid),
  { ssr: false }
)
const PolarAngleAxis = dynamic(
  () => import('recharts').then((mod) => mod.PolarAngleAxis),
  { ssr: false }
)
const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
)
const PolarRadiusAxis = dynamic(
  () => import('recharts').then((mod) => mod.PolarRadiusAxis),
  { ssr: false }
)

// ─── Design Tokens ────────────────────────────────────────────────────────────
const NAVY = '#1A1A2E'
const CORAL = '#E94560'
const BG_LIGHT = '#F5F7FA'
const BODY_TEXT = '#444444'

// ─── Radar chart data ─────────────────────────────────────────────────────────
const radarData = [
  { category: 'Guidance & Communication', score: 75 },
  { category: 'Awareness & Exposure', score: 60 },
  { category: 'Engagement & Support Habits', score: 80 },
  { category: 'Planning & Financial Readiness', score: 55 },
  { category: 'Mindset & Adaptability', score: 70 },
]

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
}

// ─── Reusable mini radar chart ────────────────────────────────────────────────
function MiniRadar({ dark = false }: { dark?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart outerRadius="55%" data={radarData}>
        <PolarGrid stroke={dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 8, fill: dark ? '#CCCCCC' : '#555555' }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="score"
          stroke={CORAL}
          fill={CORAL}
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// ─── Category list items ──────────────────────────────────────────────────────
const categories = [
  {
    label: 'Guidance & Communication',
    sub: 'How well you direct your child',
    initial: 'G',
  },
  {
    label: 'Awareness & Exposure',
    sub: 'Quality of opportunities you create',
    initial: 'A',
  },
  {
    label: 'Engagement & Support',
    sub: 'How present and involved you are',
    initial: 'E',
  },
  {
    label: 'Planning & Financial Readiness',
    sub: 'How prepared you are',
    initial: 'P',
  },
  {
    label: 'Mindset & Adaptability',
    sub: 'How open and growth-focused you are',
    initial: 'M',
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote:
      'Since taking the Score assessment I now know exactly where I was falling short. My son got into his dream college 6 months later.',
    name: 'Ramesh K.',
    title: 'Parent, Bangalore',
    initials: 'RK',
  },
  {
    quote:
      'I thought I was doing everything right. The results were a reality check — and the best thing that happened to us.',
    name: 'Sunita M.',
    title: 'Parent, Mumbai',
    initials: 'SM',
  },
  {
    quote:
      'The category breakdown showed me I was great at guidance but weak on financial planning. Game changer.',
    name: 'Arjun P.',
    title: 'Parent, Hyderabad',
    initials: 'AP',
  },
  {
    quote:
      'I shared this with my husband and we both took it. We had our most productive conversation about our daughter\'s future the same evening.',
    name: 'Meera T.',
    title: 'Parent, Chennai',
    initials: 'MT',
  },
]

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', scrollBehavior: 'smooth' }}
    >
      {/* ─── SECTION 1: Navbar ─────────────────────────────────────────────── */}
      <nav
        className="w-full border-b px-4 md:px-6 py-4 flex items-center overflow-hidden"
        style={{ backgroundColor: NAVY, borderBottomColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex flex-wrap items-baseline gap-2 md:gap-3 min-w-0">
          <span className="text-sm md:text-xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
            NEW AGE PARENTING
          </span>
        </div>
      </nav>

      {/* ─── SECTION 2: Hero ───────────────────────────────────────────────── */}
      <section className="bg-white py-12 md:py-20 px-4 md:px-6 flex flex-col items-center text-center">
        <div className="max-w-4xl w-full px-4 md:px-0 overflow-visible">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-semibold mb-4 tracking-wide uppercase"
            style={{ color: CORAL }}
          >
            Instant results + tailored report + personalised insights
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full break-words overflow-visible text-center text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 px-2 md:px-0"
            style={{ color: NAVY }}
          >
            Are you truly the{" "}
            <span className="block md:inline md:whitespace-nowrap" style={{ color: CORAL }}>
              Key Person of Influence
            </span>{" "}
            in your child&apos;s Education and Career?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base mb-10 leading-relaxed"
            style={{ color: '#6B7280' }}
          >
            Take the Quiz and find out exactly how influential you
            are in shaping your child&apos;s career. Results in 20 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link
              href="/assessment/1"
              className="block md:inline-block w-full md:w-auto text-center text-white font-semibold mx-4 md:mx-0 px-10 py-4 rounded-full text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: CORAL }}
            >
              Discover Your Score →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-12 w-full flex justify-center"
          >
            <Image
              src="/parenting-infographic.png"
              alt="New Age Parenting: Shaping Career Success in Indian Children"
              width={800}
              height={800}
              className="w-full max-w-3xl rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 3: Product Preview Card ──────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-6" style={{ backgroundColor: BG_LIGHT }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row"
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {/* Left panel */}
            <div className="flex-1 p-6 md:p-10 w-full overflow-hidden">
              <p className="text-xl md:text-3xl font-black tracking-widest mb-0.5 break-words" style={{ color: NAVY }}>
                KEY PERSON OF INFLUENCE
              </p>
              <p className="text-xl font-bold mb-3" style={{ color: CORAL }}>
                Pillars of Parenting Influence
              </p>
              <p className="text-sm mb-7" style={{ color: BODY_TEXT }}>
                Benchmark your influence on your child&apos;s future.
              </p>

              <ul className="space-y-4">
                {categories.map((cat, i) => (
                  <motion.li
                    key={cat.label}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: CORAL }}
                    >
                      {cat.initial}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: NAVY }}>
                        {cat.label}
                      </p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>
                        {cat.sub}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right panel */}
            <div
              className="flex-1 p-6 md:p-10 flex flex-col justify-between w-full"
              style={{ backgroundColor: '#F8F9FF' }}
            >
              {/* Score preview */}
              <div className="mb-4">
                <p
                  className="mb-3"
                  style={{
                    fontSize: '18px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: CORAL,
                    fontWeight: 700,
                  }}
                >
                  Your Profile
                </p>
                <p className="text-sm font-medium mb-1" style={{ color: BODY_TEXT }}>
                  Your overall score:
                </p>
                <p className="text-4xl font-black" style={{ color: CORAL }}>
                  76%
                </p>
              </div>

              {/* Radar chart */}
              <div
                className="w-full max-w-xs mx-auto flex justify-center items-center pt-2 pb-2"
                style={{ minHeight: 280 }}
              >
                <MiniRadar />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 4: How It Works ───────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-6" style={{ backgroundColor: '#F0F2F5' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: NAVY }}
            >
              How it works.
            </h2>

            <p className="text-sm mb-8 leading-relaxed" style={{ color: BODY_TEXT }}>
              <span className="font-bold mr-2" style={{ color: CORAL }}>→</span>
              We&apos;ll ask you 40 questions across 5 areas of parenting influence.
              In 20 minutes you&apos;ll have a tailored report showing exactly
              where to improve.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                {
                  title: 'Research-Based Questions',
                  desc: 'Questions derived from research on the key traits of influential parents',
                },
                {
                  title: 'Detailed Score Breakdown',
                  desc: 'Receive an overall score plus individual scores for each of the 5 categories',
                },
                {
                  title: 'Personalised Report',
                  desc: 'Get actionable steps to immediately improve your parenting influence score',
                },
              ].map((item, i) => (
                <motion.li
                  key={item.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="flex items-start gap-3"
                >
                  <span className="font-bold text-lg leading-none mt-0.5" style={{ color: CORAL }}>
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: NAVY }}>
                      {item.title}
                    </p>
                    <p className="text-sm" style={{ color: BODY_TEXT }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Link
              href="/assessment/1"
              className="block md:inline-block text-center text-white font-semibold px-8 py-3 rounded-full text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: CORAL }}
            >
              Get your score now
            </Link>
          </motion.div>

          {/* Right — dark mockup card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 md:p-8 flex flex-col items-center w-full"
            style={{
              backgroundColor: NAVY,
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
            }}
          >
            <p
              className="text-base font-semibold text-center mb-6"
              style={{ color: '#E5E7EB' }}
            >
              Find out how influential you are in your child&apos;s career.
            </p>
            <div
              className="w-full max-w-xs mx-auto flex justify-center items-center pt-2 pb-2"
              style={{ minHeight: 280 }}
            >
              <MiniRadar dark />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 5: Step Up ────────────────────────────────────────────── */}
      <section className="bg-white py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="font-bold leading-tight"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: NAVY }}
            >
              Leverage your parenting with our scorecard
            </h2>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <p className="text-base leading-relaxed" style={{ color: BODY_TEXT }}>
              Tap into your true potential — measure your parenting influence
              today and get tailored steps for growth.
            </p>

            <div>
              <Link
                href="/assessment/1"
                className="block md:inline-block text-center text-white font-semibold px-8 py-3 rounded-full text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: CORAL }}
              >
                Step up your parenting
              </Link>
            </div>

            {/* 5-category ring — flex-wrap on mobile, ring layout on md+ */}
            <div className="mt-4">
              {/* Mobile: simple flex wrap grid */}
              <div className="flex flex-wrap justify-center gap-4 md:hidden">
                {[
                  { label: 'Guidance & Communication', angle: -90 },
                  { label: 'Awareness & Exposure', angle: -18 },
                  { label: 'Engagement & Support Habits', angle: 54 },
                  { label: 'Planning & Financial Readiness', angle: 126 },
                  { label: 'Mindset & Adaptability', angle: 198 },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="flex flex-col items-center w-24"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 shadow"
                      style={{ backgroundColor: i % 2 === 0 ? CORAL : NAVY }}
                    >
                      {item.label[0]}
                    </div>
                    <span
                      className="text-xs font-medium text-center"
                      style={{ color: NAVY, fontSize: '10px' }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Desktop: original ring layout */}
              <div className="relative hidden md:flex items-center justify-center">
                <div className="relative w-56 h-56">
                  {[
                    { label: 'Guidance & Communication', angle: -90 },
                    { label: 'Awareness & Exposure', angle: -18 },
                    { label: 'Engagement & Support Habits', angle: 54 },
                    { label: 'Planning & Financial Readiness', angle: 126 },
                    { label: 'Mindset & Adaptability', angle: 198 },
                  ].map((item, i) => {
                    const rad = (item.angle * Math.PI) / 180
                    const cx = 50 + 42 * Math.cos(rad)
                    const cy = 50 + 42 * Math.sin(rad)
                    return (
                      <motion.div
                        key={item.label}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `${cx}%`,
                          top: `${cy}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 shadow"
                          style={{
                            backgroundColor: i % 2 === 0 ? CORAL : NAVY,
                          }}
                        >
                          {item.label[0]}
                        </div>
                        <span
                          className="text-xs font-medium text-center whitespace-nowrap"
                          style={{ color: NAVY, fontSize: '10px' }}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 6: Social Proof Banner ───────────────────────────────── */}
      <section
        className="relative py-12 md:py-16 px-6 md:px-8 overflow-hidden"
        style={{ backgroundColor: NAVY }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-light leading-relaxed mb-6"
            style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', color: '#FFFFFF' }}
          >
            &ldquo;Within 3 months of taking the Score assessment, I completely
            transformed how I guide my child&apos;s career path.&rdquo;
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm font-semibold"
            style={{ color: CORAL }}
          >
            Priya Sharma | Parent, Grade 11 Student
          </motion.p>
        </div>

        {/* Decorative coral half-circle */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 120,
            height: 60,
            backgroundColor: CORAL,
            borderRadius: '60px 60px 0 0',
            opacity: 0.25,
          }}
        />
      </section>

      {/* ─── SECTION 7: Testimonials Grid ─────────────────────────────────── */}
      <section className="bg-white py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-center mb-8 md:mb-12"
            style={{ color: NAVY }}
          >
            What parents are saying.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="p-4 md:p-6 rounded-2xl flex flex-col gap-4"
                style={{
                  borderRadius: 12,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F0F2F5',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} style={{ color: CORAL }}>
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: BODY_TEXT }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: NAVY }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: NAVY }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      {t.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: Footer ─────────────────────────────────────────────── */}
      <footer
        className="bg-white border-t py-8 px-4 md:px-6"
        style={{ borderTopColor: 'rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Left — brand */}
          <div>
            <p className="text-lg font-bold" style={{ color: NAVY }}>
              KEY PERSON OF INFLUENCE
            </p>
            <p className="text-xs font-medium" style={{ color: CORAL }}>
              Key Person of Influence
            </p>
          </div>

          {/* Centre — copyright */}
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            Copyright &copy; 2025 KEY PERSON OF INFLUENCE. All Rights Reserved.
          </p>

          {/* Right — badge */}
          <p
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              color: '#9CA3AF',
              border: '1px solid #E5E7EB',
            }}
          >
            Powered by KEY PERSON OF INFLUENCE
          </p>
        </div>
      </footer>
    </div>
  )
}
