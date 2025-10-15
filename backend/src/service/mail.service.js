import nodeMailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.VYBE_GMAIL,
    pass: process.env.VYBE_APP_PASSWORD,
  },
});

export const sendMail = async (recieverMail, otp)=>{
try {
      const info = await transporter.sendMail({
      from: process.env.VYBE_GMAIL,
      to: recieverMail, 
      subject: "forgot Password Otp", 
      html: `<p>Your OTP for password reset is <b> ${otp}</b>.
      It expires in 5 minutes.
      </p>`,
    });
} catch (error) {
    console.log(error)
}
}