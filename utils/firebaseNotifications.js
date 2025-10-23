const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

async function sendPushNotification(token, title, body) {
  try {
    if (!token) {
      console.log("No Firebase token");
      return false;
    }

    const message = { token, notification: { title, body } };
    await admin.messaging().send(message);
    console.log("Push notification sent");
    return true;
  } catch (error) {
    console.error("Notification error:", error);
    return false;
  }
}

module.exports = { sendPushNotification };
