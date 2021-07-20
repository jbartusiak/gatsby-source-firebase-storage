import { ParentSpanPluginArgs } from "gatsby";
import * as admin from "firebase-admin";
import { initFirebase } from "../firestore-storage";
import path from "path";
import fs from "fs";
import { storage } from "firebase-admin/lib/storage";
import { StorageType } from "../types/storage.model";
import { createDirectory, extractFileName, GetCache, retrieveCache } from "../utils/utils";

const createMarkdownSources = async (
    {getCache}: ParentSpanPluginArgs,
    {collectionPrefix, typeExt, name}: StorageType,
    storage: storage.Storage
) => {
    const [ files ] = await storage.bucket().getFiles({
        prefix: collectionPrefix,
    });

    const pluginCache = retrieveCache(getCache as GetCache)
    createDirectory(pluginCache, name);

    const promises = files
        .filter(file => file.name.match(/\.\w+$/))
        .map(async file => {
            const fileName = extractFileName(file.name);
            const destination = path.join(pluginCache.directory, name, `${fileName}${typeExt}`);
            if (fs.existsSync(destination)) {
                return Promise.resolve();
            }
            return await file.download({
                destination
            });
        });

    await Promise.all(promises);
    return Promise.resolve();
}

export const onPreInit = async (args: ParentSpanPluginArgs, options: admin.AppOptions & { types: StorageType[] }) => {
    const storage = initFirebase({
        credential: options.credential,
        storageBucket: options.storageBucket
    }).storage();

    return await Promise.all(options.types.map(type => {
        createMarkdownSources(args, type, storage);
    }));
}
