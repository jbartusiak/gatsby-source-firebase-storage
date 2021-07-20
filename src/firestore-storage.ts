import * as admin from 'firebase-admin';

export const PLUGIN_NAME = '@bartusiak/gatsby-source-firebase-storage';

export const initFirebase = ({ credential, storageBucket}) => {
  return admin.initializeApp({
    credential: admin.credential.cert(credential),
    storageBucket,
  }, PLUGIN_NAME);
};
