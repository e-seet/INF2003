require("dotenv").config();
const AWS = require("aws-sdk");
const AWSCognitoIdentity = process.env.AWSCognitoIdentity;
const AWSCognitoIdentitySMS = process.env.AWSCognitoIdentitySMS;
const AWSCognitoIdentityEmail = process.env.AWSCognitoIdentityEmail;

/**
 * Sends an email using AWS Simple Email Service (SES).
 *
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to include in the email.
 * @returns {Promise} - Resolves when the email is successfully sent.
 */
const awssendemail = async (email, otp) => {
  // Configure AWS credentials and region
  AWS.config.update({
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSCognitoIdentityEmail,
    }),
    region: "us-east-1", // Change to your AWS SES region
  });

  console.log("Preparing to send email...");

  // Email parameters
  const params = {
    Destination: {
      ToAddresses: [email], // Recipient's email address
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>Hello from INF2003</h1>
                 <p>Your verification code is: <strong>${otp}</strong></p>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "[Action Required] Verify Your Account",
      },
    },
    Source: "13eddie07@gmail.com", // Verified email address
  };

  // Create SES service object
  const ses = new AWS.SES({ apiVersion: "2010-12-01" });

  try {
    // Send the email
    const result = await ses.sendEmail(params).promise();
    console.log(`Email sent successfully to ${email}: ${result.MessageId}`);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

// Not in use for now
async function autoReplySms(data) {
  console.log("Auto-replying via SMS...");

  // Configure AWS credentials and region
  AWS.config.update({
    region: "ap-southeast-1",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSCognitoIdentitySMS,
    }),
  });

  // Message and recipient details
  const params = {
    Message: `[Pet Store] Hi ${data.name}, we have received your feedback, and our staff will contact you shortly!`,
    PhoneNumber: `+65${data.phone}`, // Add country code prefix
  };

  try {
    // Send SMS using AWS SNS
    const sns = new AWS.SNS({ apiVersion: "2010-03-31" });
    const result = await sns.publish(params).promise();
    console.log(
      "Auto-reply SMS sent successfully. MessageID:",
      result.MessageId,
    );
    return result;
  } catch (err) {
    console.error("Failed to send auto-reply SMS:", err);
    throw new Error("Failed to send auto-reply SMS.");
  }
}

async function sendSMS(phone) {
  console.log("Sending SMS...");

  // Configure AWS credentials and region
  AWS.config.update({
    region: "ap-southeast-1",
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AWSCognitoIdentitySMS,
    }),
  });

  // Message and recipient details
  const params = {
    Message: "Your OTP is:" + phone + "",
    PhoneNumber: `+65${phone}`, // Add country code prefix
  };

  try {
    // Send SMS using AWS SNS
    const sns = new AWS.SNS({ apiVersion: "2010-03-31" });
    const result = await sns.publish(params).promise();
    console.log("SMS sent successfully. MessageID:", result.MessageId);
    return result;
  } catch (err) {
    console.error("Failed to send SMS:", err);
    throw new Error("Failed to send SMS.");
  }
}

module.exports = { awssendemail, autoReplySms, sendSMS };
