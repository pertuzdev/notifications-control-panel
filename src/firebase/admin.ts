const admin = require("firebase-admin");

const serviceAccount = require("./iglesiaeverapp-firebase-admin-keys.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
