import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'redwork89@gmail.com', // Cambia esto por tu correo de Gmail
    pass: 'iswh ghws giap optz', // Cambia esto por la contraseña de aplicación generada
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: '"RedWork Team" <redwork89@gmail.com>', // Cambia esto por tu nombre y correo de Gmail
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}