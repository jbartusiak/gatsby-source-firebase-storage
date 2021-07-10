import * as admin from 'firebase-admin';

export const initFirebase = ({ credential, storageBucket}) => {
  return admin.initializeApp({
    credential: admin.credential.cert(credential),
    storageBucket,
  });
};
