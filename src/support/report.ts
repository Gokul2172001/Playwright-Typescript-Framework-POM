import fs from 'fs';
import path from 'path';
import { updateCucumberReport } from './updateReport'
import { JsonData } from '../utils/JsonData';
// import report from 'multiple-cucumber-html-reporter';
const report = require('multiple-cucumber-html-reporter');

const reportFilePath = path.resolve('./reports/cucumber-json.json');

const info = new JsonData(JSON.parse(fs.readFileSync(process.cwd() + '/src/data/info.json', 'utf8')))

// Step 1: Read JSON report
let raw: any = fs.readFileSync(reportFilePath, 'utf-8');
let data: any = JSON.parse(raw);

// Step 2: Modify embeddings to convert video paths to HTML
for (const feature of data) {
    for (const scenario of feature.elements || []) {
        for (const step of scenario.steps || []) {
            if (!step.embeddings) continue;

            step.embeddings = step.embeddings.map((embedding: any) => {
                const isVideoText =
                    embedding.mime_type === 'text/plain' &&
                    typeof embedding.data === 'string' &&
                    embedding.data.startsWith('VIDEO_PATH:');

                if (isVideoText) {
                    const videoPathRaw = embedding.data.replace('VIDEO_PATH:', '').trim();
                    const videoPath = videoPathRaw.replace(/\\/g, '/'); // Ensure forward slashes

                    return {
                        data: `
              <video width="600" controls>
                <source src="${videoPath}" type="video/webm">
            	Your browser does not support the video tag.
              </video>
        	`,
                        mime_type: 'text/html',
                    };
                }

                return embedding;
            });
        }
    }
}
for (const feature of data) {
    for (const scenario of feature.elements || []) {
        for (const step of scenario.steps || []) {
            if (!step.embeddings) continue;
            step.embeddings.forEach((emb: any, idx: number) => {
                if (emb.mime_type === 'text/plain' && emb.data.includes('VIDEO_PATH:')) {
                    console.log(`Step "${step.name}" embedding #${idx}:`, emb.data);
                }
            });
        }
    }
}

// Step 3: Write modified report back
fs.writeFileSync(reportFilePath, JSON.stringify(data, null, 2), 'utf-8');

updateCucumberReport();
// Step 4: Generate HTML report
report.generate({
    jsonDir: './reports',
    reportPath: './reports/',
    reportName: 'Crest Automation Report',
    pageTitle: 'Crest',
    displayDuration: true,
    metadata: {
        browser: {
            name: info.get("Browser"),
            version: info.get("BrowserVersion"),
        },
        device: info.get("Device"),
        platform: {
            name: info.get("DevicePlatform"),
            version: info.get("DeviceVersion"),
        },
    },
    customData: {
        title: info.get("Project"),
        data: [
            { label: 'Branch', value: info.get("Branch") },
            { label: 'Executor', value: info.get("Executor") },
            { label: 'Excutor Address', value: info.get("ExecutorAddress") },
            { label: "Ip Address", value: info.get("IpAddress") },
            { label: 'Start Time', value: info.get("ExecutionStartedTime") },
            { label: 'End Time', value: info.get("ExecutionEndedTime") },
            { label: 'Total Time', value: info.get("TotalExecutionTime") },
            // { label: 'Release', value: '1.2.3' },
            // { label: 'Cycle', value: 'Smoke-1' },
        ],
    },
});
