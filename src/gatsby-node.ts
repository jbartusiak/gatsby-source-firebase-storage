import { initFirebase } from "./firestore-storage";
import * as admin from 'firebase-admin';

let fbStorage: admin.storage.Storage;

export function onPreInit(_, options: admin.AppOptions) {
  console.log('---INITIALIZING FIREBASE SOURCE STORAGE---');
  console.log('CREDENTIAL: ', options.credential);
  console.log('STORAGE_BUCKET: ', options.storageBucket);
  fbStorage = initFirebase({
    credential: options.credential,
    storageBucket: options.storageBucket
  });
  console.log('---FINISHED FIREBASE SOURCE STORAGE---');
}

export function pluginOptionsSchema({ Joi }) {
  Joi.object({
    credential: Joi.object().required(),
    storageBucket: Joi.string().required(),
  });
}

// const createSourceNodes = async (actions, createContentDigest, types) => {
//   const { createNode } = actions;
//
//   storage
//
//   return Promise.all(promises);
// };

// exports.sourceNodes = async ({ actions, createContentDigest }, { types }) =>
//   Promise.all();
