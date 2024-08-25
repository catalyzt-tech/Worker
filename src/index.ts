import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as fs from "fs";
import * as path from "path";
import 'dotenv/config'
import { TriggerModule } from "./controller/trigger-module";
import { GetStaticData } from "./controller/get-static-data";
import { scheduleCronJobs } from "../utils/utils";
import cors from '@fastify/cors'
const fastify: FastifyInstance = Fastify();

let origin:string = "*"
if (process.env.NODE_ENV === 'production') {
    origin = process.env.CORS
}

fastify.register(cors, { 
    origin: origin
})

const scriptsDir = path.resolve(__dirname, 'scripts');

// res use to store the api path of the modules
// the key is the file name and the value is the api path
const fileNameAndApiPath: { [key: string]: string } = {}

// cronJobsToSchedule use to store the cron jobs that need to be scheduled
const cronJobsToSchedule: { CRON_TIMER: string; run: () => void; dataDir: string }[] = [];

// Store imported modules
// the key is the file name and the value is the module (function to run)
// type value can't be Promise<void> because it will cause error of promising a value
export const importedModules: { [key: string]: any } = {};

// processScripts use to check if there any module that need to be run
async function processScripts() {
    // const module = require('./scripts/gov-doc/gov-doc.js');
    
    // console.log("here testing ", module);

    try {
        const folders = await fs.promises.readdir(scriptsDir);
        
        for (const folder of folders) {
            const files = await fs.promises.readdir(path.resolve(scriptsDir, folder));
            
            for (const file of files) {

                let targetExtension = ".ts"
                if (process.env.NODE_ENV === 'production') {
                    targetExtension = ".js"
                }

                if (path.extname(file) === targetExtension) {
                    try {
                        // import the script
                        const filePath = path.resolve(__dirname, scriptsDir, folder, file);
                        const module = require(filePath);
 
                        // get the data dir
                        const dataDir = module.DATA_DIR.join("").replace("data","");

                        // get the api path
                        const apiPath = "/api/modules/run/" + file;
                        
                        // add to the res object
                        fileNameAndApiPath[file] = apiPath;
                        // console.log(`File: ${file}, API_PATH: ${apiPath}`);

                        const fullDataDir = path.resolve(process.cwd(), "data", dataDir);
                        if (!fs.existsSync(fullDataDir)) {
                            console.log(`Data directory ${fullDataDir} does not exist. Running module.Run() first.`);
                            await module.Run();
                        }

                        // console.log("here is cron timer only file",module.DATA_DIR, " ", module.CRON_TIMER, module)
                        // if there is a cron timer, schedule the cron job
                        if (typeof(module.CRON_TIMER) === "string" && module.CRON_TIMER.trim() !== "") {
                            console.log(`Scheduling cron job for ${file} with timer: ${module.CRON_TIMER}`);
                            cronJobsToSchedule.push({
                                CRON_TIMER: module.CRON_TIMER,
                                run: module.Run,
                                dataDir: dataDir,
                            });
                        } else {
                            console.log(`No valid cron timer for ${file}, skipping cron job scheduling.`);
                        }

                        // Store the imported module
                        importedModules[file] = module;
                    } catch (error) {
                        console.error(`Error importing ${file}: ${error}`);
                    }
                }
            }
        }
        
        if (cronJobsToSchedule.length > 0) {
            console.log(`Scheduling ${cronJobsToSchedule.length} cron job(s)`);
            scheduleCronJobs(cronJobsToSchedule);
        } else {
            console.log("No cron jobs to schedule.");
        }
    } catch (err) {
        console.error(`Could not process scripts: ${err}`);
    }
}



async function startServer() {
    console.log("Reading scripts directory . . .\n");

    await processScripts();


    fastify.get('/api/modules', async (request: FastifyRequest, reply: FastifyReply) => {
        reply.status(200).send({
            msg: "ok",
            data: fileNameAndApiPath
        });
    });

    fastify.post<{ Params: { scriptName: string } }>('/api/modules/run/:scriptName', TriggerModule);
    
    fastify.get<{ Params: { '*': string } }>('/api/*', GetStaticData);

    // Serve static files from the 'data' directory
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '..', 'data'),
        prefix: '/data/', // This will be the URL prefix
    });
    
    const port = process.env.PORT || 3001;

    fastify.listen({ port: Number(port), host: "0.0.0.0" }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server is listening on ${address}`);
    });
}

startServer();