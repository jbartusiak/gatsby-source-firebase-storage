import * as admin from 'firebase-admin';
import { PLUGIN_NAME } from "./gatsby-node";

export const initFirebase = ({ credential, storageBucket}) => {
  return admin.initializeApp({
    credential: admin.credential.cert(credential),
    storageBucket,
  }, PLUGIN_NAME);
};
