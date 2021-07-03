const { initFirebase } = require('./firestore-storage');

let firestore;

exports.onPreInit = (_, { credential }) => {
  firestore = initFirebase(credential);
};

exports.pluginOptionsSchema = ({ Joi }) =>
  Joi.object({
    credential: Joi.object().required(),
  });

const createSourceNodes = async (actions, createContentDigest, types) => {
  const { createNode } = actions;

  const promises = types.map(async ({ collection, type, map }) => {
    const snapshot = await firestore.collection(collection).get();
    snapshot.docs.forEach(doc => {
      const contentDigest = createContentDigest(doc.id);
      createNode({
        ...map(doc.data()),
        id: doc.id,
        parent: null,
        children: [],
        internal: {
          type,
          contentDigest,
        },
      });
      Promise.resolve();
    });
  });

  return Promise.all(promises);
};

exports.sourceNodes = async ({ actions, createContentDigest }, { types }) =>
  Promise.all([createSourceNodes(actions, createContentDigest, types)]);
