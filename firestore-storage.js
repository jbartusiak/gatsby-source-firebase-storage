const admin = require('firebase-admin');

const initFirebase = ({ credential, bucket }) => {
  const app = admin.initializeApp({
    credential: admin.credential.cert(credential),
    bucket
  });
  return app.storage();
};

module.exports = { initFirebase };
