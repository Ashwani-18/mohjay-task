const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();


console.log("TWILIO_SID:", process.env.TWILIO_SID);
console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(phone, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(`SMS sent to ${phone}:`, response.sid);
  } catch (err) {
    console.error("SMS send error:", err.message);
    throw err;
  }
}

module.exports = sendSMS;
