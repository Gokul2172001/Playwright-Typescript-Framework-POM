import dynamic from "../data/dynamic-data/dynamic.json"
import { setData } from "../utils/dynamic-dataGen"
import { merge } from "lodash";
import fs from 'fs';
import path from "path";
import { setInformations } from "../utils/infoGen";
import { warn } from "console";


export function getDynamicJson() {
    const easyjson = require("easyjson");
    return easyjson.path("./src/data/dynamic-data/dynamic.json");
}

export function getInfoJson() {
    const easyjson = require("easyjson");
    return easyjson.path("./src/data/info.json");
}

if (require.main === module) {
    // This code only runs in the main process, not in the spawned subprocess.
    if (dynamic.Executed != new Date().getDate().toString()) {
        try {
            setData();
            setInformations();
            main();
            console.log("> ✔️ | Preconfigurations are Completed.");
        } catch (e) {
            warn('> ℹ️  Preconfigurations got Interrupted:', e);
        }
    } else {
        console.log("> ✔️ | Preconfigurations were Already Completed.");
    }
}

function loadJson(filePath: string): any {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
        return {}
    }
    const content = fs.readFileSync(filePath, 'utf8')
    try {
        return JSON.parse(content)
    } catch (e) {
        console.info(`${filePath} does not exist.ℹ️`);
        return {}
    }
}

function mergeJsonFolder(folderPath: string): object {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return {};
    }

    function walk(dir: string): string[] {
        let results: string[] = [];
        const list = fs.readdirSync(dir);

        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                results = results.concat(walk(filePath));
            } else if (file.endsWith('.json')) {
                results.push(filePath);
            }
        });

        return results;
    }

    const allJsonFiles = walk(folderPath);
    const objects = allJsonFiles.map(loadJson);
    return merge({}, ...objects);
}

function main() {
    
    const baseDir = path.resolve(process.cwd(), 'src/data/');

    // const filesToMerge = [
    // 	path.join(baseDir, 'tdCommon.json'),
    // 	path.join(baseDir, 'tdEnv.json'),
    // ];
    const foldersToMerge = [
        "common-data",
        "test"
    ];

    // const folderToMerge = path.join(baseDir, 'common-data');

    // const fileData = filesToMerge.map(loadJson);

    // const folderData = mergeJsonFolder(folderToMerge);

    // const merged = merge({}, ...fileData, folderData);
    const merged = merge(
        {},
        ...foldersToMerge.map(folder => {
            const folderPath = path.join(baseDir, folder);
            return mergeJsonFolder(folderPath);
        })
    );

    const outputPath = path.join(baseDir, 'test-data/data.json');
    fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');
}
