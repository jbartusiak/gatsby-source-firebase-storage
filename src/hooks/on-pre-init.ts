import { GatsbyCache, ParentSpanPluginArgs } from "gatsby";
import * as admin from "firebase-admin";
import { initFirebase, PLUGIN_NAME } from "./firestore-storage";
import path from "path";
import fs from "fs";
import { storage } from "firebase-admin/lib/storage";

interface StorageType {
    collectionPrefix: string;
    typeExt: string;
    name: string;
}

const extractFileName = (fullPath: string) => {
    const [name,] = fullPath.split('.');
    const lastSlash = name.lastIndexOf('/');
    return name.substr(lastSlash+1);
}

type GetCache = (name: string) => GatsbyCache;

const retrieveCache = (cache: GetCache) => cache(PLUGIN_NAME);

const createDirectory = (cache: GatsbyCache, name: string) => {
    const cacheDirectory = cache.directory;
    const folderDir = path.join(cacheDirectory, name);
    if (!fs.existsSync(folderDir)) {
        fs.mkdirSync(folderDir);
    }
    return;
}

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

    console.log(`All ${name} files downloaded`);

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
