import * as nodemailer from 'nodemailer';
import { config } from '../../../../config';
import { error } from '../../utils';

export const sendEmail = async ({ email, body, subject }, res) => {
    try {
        await mailSend(email, subject, body, res);
        return;
    } catch (err) {
        console.log(err);
    }
}

const mailSend = async (email, subject, html, res) => {
   const mailOptions = {
      from: config.email.address,
      to: email,
      subject: subject,
      html: html
   }
   const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      service: 'gmail',
      auth: {
         user: config.email.username,
         pass: config.email.password
      }
   });
   try {
      const res = await transporter.sendMail(mailOptions);
      if (!res) return error().resourceError(res, 'Email Send Failed!', 500)
      else return res.status(200).json({ message: 'Email Send Successful' });
   } catch (err) {
      console.log(err);
      return error().resourceError(res, 'Email Send Failed!', 500)
   }
};