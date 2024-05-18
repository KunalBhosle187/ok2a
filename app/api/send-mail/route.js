const nodemailer = require("nodemailer");

export async function POST(request, response) {
  const filename = await request.text(); // user id
  console.log({ filename });

  // Create a Nodemailer transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Your SMTP host
    port: 587, // Your SMTP port
    secure: false, // true for 465, false for other ports
    auth: {
      user: "synvm.support@synradar.com", // Your email address
      pass: "sP@rms!2821!", // Your password
    },
  });

  // Define email options
  let mailOptions = {
    from: "synvm.support@synradar.com", // Sender address
    to: "kunal.bhosle@synradar.com", // List of recipients
    subject: filename.replaceAll("_", " ").replace(".csv", ""), // Subject line
    text: `
    Dear Sir,

    I hope this email finds you well. I'm sending you the ${filename} file. Please find the attached file and let me know if you need any further assistance or if there's anything else I can assist you with. Feel free to reach out if you have any questions or require additional information.
    
    Thank you for your attention to this matter.
    
    Best regards,
    Synradar Support
    synvm.support@synradar.com
    
 `,
    attachments: [
      {
        filename: filename, // Name of the attachment
        path: `public/${filename}`, // Path to the attachment file
      },
    ],
  };

  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return Response.json("Message sent successfully");
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    return Response.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
