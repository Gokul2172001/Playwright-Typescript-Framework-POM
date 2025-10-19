import fs from 'fs';
import path from 'path';
import { JsonData } from './../utils/JsonData';

export const updateCucumberReport = (): void => {
    
    const reportFilePath = path.resolve('./reports/cucumber-json.json');
    const testDataPath = path.resolve('./src/data/test-data/data.json');
    const value = new JsonData(
        JSON.parse(fs.readFileSync(testDataPath, 'utf8'))
    );

    const reportData: any = JSON.parse(fs.readFileSync(reportFilePath, 'utf-8'));

    for (const feature of reportData) {
        for (const element of feature.elements || []) {
            if (element.name.includes(':-')) {
                const [prefix, key] = element.name.split(':-');
                const trimmedKey = key.trim();
                const replacement = value.get(trimmedKey);

                if (replacement !== undefined) {
                    element.name = `${prefix.trim()}: "${replacement}"`;
                    // console.log(`🟢 Replaced :- style in element.name: ${element.name}`);
                } else {
                    element.name = `${prefix.trim()}: "${trimmedKey}"`;
                    // console.warn(`🟡 No value found for :- key: "${trimmedKey}". Kept original key with quotes.`);
                }
            }

            // ✅ Step 2: Replace all quoted strings in element.name (quotes always preserved)
            element.name = element.name.replace(/"([^"]+)"/g, (match: string, key: string) => {
                const dynamicValue = value.get(key.trim());

                if (typeof dynamicValue === 'string' || typeof dynamicValue === 'number') {
                    return `"${dynamicValue}"`;
                }

                return `"${key}"`; // preserve original quoted key
            });

            // ✅ Step 3: Update ID using the suffix after `:` (optional)
            const idParts = element.id.split(':');
            if (idParts.length === 2) {
                const idSuffix = idParts[1].replace(/^[-]+/, '').trim();
                const replacement = value.get(idSuffix);
                if (replacement) {
                    element.id = `${idParts[0]}:${replacement}`;
                    // console.log(`🔵 Updated scenario id: ${element.id}`);
                }
            }

            // ✅ Step 4: Replace quoted strings in each step.name (with quotes)
            for (const step of element.steps || []) {
                if (!step.name) continue;

                step.name = step.name.replace(/"([^"]+)"/g, (match: string, key: string) => {
                    const dynamicValue = value.get(key.trim());

                    if (typeof dynamicValue === 'string' || typeof dynamicValue === 'number') {
                        return `"${dynamicValue}"`;
                    }

                    return `"${key}"`; // keep original quoted key
                });
            }
        }
    }

    fs.writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2), 'utf-8');
    console.log('✅ Cucumber report updated successfully.');
};
