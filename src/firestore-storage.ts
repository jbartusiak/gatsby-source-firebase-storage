import * as admin from 'firebase-admin';

export const initFirebase = ({ credential, storageBucket}) => {
  const app = admin.initializeApp({
    credential: admin.credential.cert(credential),
    storageBucket,
  });
  return app.storage();
};
