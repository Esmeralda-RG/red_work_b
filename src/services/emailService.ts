import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'redwork89@gmail.com', 
    pass: 'iswh ghws giap optz', 
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const info = await transporter.sendMail({
      from: '"RedWork Team" <redwork89@gmail.com>', 
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}