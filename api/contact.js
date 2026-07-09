const rateLimitMap = new Map()

function isRateLimited(ip) {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const maxRequests = 3

  const entry = rateLimitMap.get(ip)
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, start: now })
    return false
  }

  if (now - entry.start > windowMs) {
    rateLimitMap.set(ip, { count: 1, start: now })
    return false
  }

  entry.count++
  if (entry.count > maxRequests) return true
  return false
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const { name, email, subject, message } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' })
  }
  if (!message || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters.' })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'delivered@resend.dev'

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured — contact email would not be sent in production.')
    return res.status(200).json({ success: true, note: 'Development mode — email not sent.' })
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(RESEND_API_KEY)

    const { error: sendError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `[Portfolio] ${subject || 'New Message'} from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return res.status(500).json({ error: 'Failed to send email. Please try again.' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact error:', err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}