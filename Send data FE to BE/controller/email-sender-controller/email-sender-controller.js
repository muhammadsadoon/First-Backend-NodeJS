import nodemailer from "nodemailer";

export async function emailSenderController(req, res) {
    console.log(req.body);
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).send({
                status: false,
                code: 400,
                message: "please send the email from frontend"
            })
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_ADMIN_EMAIL,
                pass: process.env.SENDER_ADMIN_PASSWORD
            }
        })

        const receiverDtails = {
            from: process.env.SENDER_ADMIN_EMAIL,
            to: email,
            subject: "Email Verification Step 2",
            html: "<h1 style='color:red;font-size:30px'>Your OTP is 1234</h1>"
        };

        const sendEmail = transporter.sendMail(receiverDtails);

        if (sendEmail) {
            res.status(200).send({
                status: false,
                code: 500,
                message: "Email was send sucessfully!!"
            })
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            code: 500,
            message: "Internal server error",
            error: err
        })
    }
}