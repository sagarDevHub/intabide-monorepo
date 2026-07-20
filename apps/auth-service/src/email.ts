import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
});

export const sendOTPEmail = async (email: string, otp: string, type: 'verify' | 'reset') => {
  const subject = type === 'verify' ? 'Verify Your Email' : 'Reset Your Password';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">IntabIDE</h2>
      <h3>${subject}</h3>
      <p>Your OTP code is:</p>
      <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
        ${otp}
      </div>
      <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes.</p>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@intabide.com',
      to: email,
      subject,
      html,
    });
    console.log(`📧 OTP Email successfully dispatched to ${email}`);
  } catch (error) {
    console.error(`❌ SMTP Delivery Failed to ${email}:`, error);
  }
};
