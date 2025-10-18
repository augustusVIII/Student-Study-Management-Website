import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL
const emailFrom = process.env.EMAIL_FROM || 'no-reply@kiteacademy.edu.vn'

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  })
}
