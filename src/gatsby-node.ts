import { initFirebase } from "./firestore-storage";
import * as admin from 'firebase-admin';
import { PluginOptions, SourceNodesArgs } from 'gatsby';
import { storage } from 'firebase-admin/lib/storage';
import { createFileNodeFromBuffer } from 'gatsby-source-filesystem';

let fbStorage: storage.Storage;

exports.onPreInit = (_, options: admin.AppOptions) => {
    fbStorage = initFirebase({
        credential: options.credential,
        storageBucket: options.storageBucket
    }).storage();
}

exports.pluginOptionsSchema = ({Joi}) =>
    Joi.object({
        credential: Joi.object().required(),
        storageBucket: Joi.string().required(),
    });

const createMarkdownSources = async ({actions, cache, createNodeId, store}: SourceNodesArgs) => {
    const {createNode} = actions;
    const [ files ] = await fbStorage.bucket().getFiles({
        prefix: 'markdown/experiments',
    });

    const promises = files
        .filter(file => file.name.match(/\.\w+$/))
        .map(async file => {
            const [buffer] = await file.download();
            const result = await createFileNodeFromBuffer({
                createNode,
                cache,
                store,
                buffer,
                createNodeId,
                name: file.name.split('.')[0],
                ext: '.mdx'
            });
            return Promise.resolve(result);
        });

    return Promise.all(promises);
}

exports.sourceNodes = async (
    args: SourceNodesArgs,
    options: PluginOptions,
) => createMarkdownSources(args);
