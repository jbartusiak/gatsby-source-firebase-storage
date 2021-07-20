import { GatsbyCache } from "gatsby";
import { PLUGIN_NAME } from "../firestore-storage";
import path from "path";
import fs from "fs";

export const extractFileName = (fullPath: string) => {
    const [ name, ] = fullPath.split('.');
    const lastSlash = name.lastIndexOf('/');
    return name.substr(lastSlash + 1);
}
export type GetCache = (name: string) => GatsbyCache;
export const retrieveCache = (cache: GetCache) => cache(PLUGIN_NAME);
export const createDirectory = (cache: GatsbyCache, name: string) => {
    const cacheDirectory = cache.directory;
    const folderDir = path.join(cacheDirectory, name);
    if (!fs.existsSync(folderDir)) {
        fs.mkdirSync(folderDir);
    }
    return;
}
