import nodemailer from 'nodemailer'
import { AppError } from './handleError';

const account = {
  user: process.env.ORG_EMAIL,
  pass: process.env.ORG_EMAIL_PASSWORD
}

export default async function sendEmail(email: string, title: string, content: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { ...account }
  })

  return await transporter.sendMail({
    from: account.user,
    to: email,
    subject: title,
    text: content
  })
    .then(info => info)
    .catch(error => new AppError('Send Email Error', 406, 'Erro ao tentar enviar email, verifique as informações e tente novamente', true))
}
