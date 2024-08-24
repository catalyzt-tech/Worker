import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import path from "path";
import 'dotenv/config'
import { TriggerModule } from "./controller/trigger-module";
import { GetStaticData } from "./controller/get-static-data";
import { scheduleCronJobs } from "../utils/utils";

const fastify: FastifyInstance = Fastify();

const scriptsDir = path.resolve(__dirname, 'scripts');

// res use to store the api path of the modules
// the key is the file name and the value is the api path
const fileNameAndApiPath: { [key: string]: string } = {}

// cronJobsToSchedule use to store the cron jobs that need to be scheduled
const cronJobsToSchedule: { cronTimer: string; run: () => void; dataDir: string }[] = [];

// Store imported modules
// the key is the file name and the value is the module (function to run)
// type value can't be Promise<void> because it will cause error of promising a value
export const importedModules: { [key: string]: any } = {};

// processScripts use to check if there any module that need to be run
async function processScripts() {
    try {
        const folders = await fs.promises.readdir(scriptsDir);
        
        for (const folder of folders) {
            const files = await fs.promises.readdir(path.resolve(scriptsDir, folder));
            
            for (const file of files) {
                if (path.extname(file) === '.ts') {
                    try {
                        // import the script
                        const filePath = path.resolve(scriptsDir, folder, file);
                        const module = await import(filePath);
                        
                        // get the data dir
                        const dataDir = module.DATA_DIR.slice(2).join("").replace("data","");
                        
                        // get the api path
                        const apiPath = "/api/modules/run/" + file;
                        
                        // add to the res object
                        fileNameAndApiPath[file] = apiPath;
                        console.log(`File: ${file}, API_PATH: ${apiPath}`);

                        const temp = module.DATA_DIR.slice(3).join("")
                        const fullDataDir = path.resolve(process.cwd(), 'data', temp);
                        if (!fs.existsSync(fullDataDir)) {
                            console.log(`Data directory ${fullDataDir} does not exist. Running module.Run() first.`);
                            await module.Run();
                        }

                        // if there is a cron timer, schedule the cron job
                        if (module.cronTimer) {
                            cronJobsToSchedule.push({
                                cronTimer: module.cronTimer,
                                run: module.Run,
                                dataDir: dataDir,
                            });
                        }

                        // Store the imported module
                        importedModules[file] = module;
                    } catch (error) {
                        console.error(`Error importing ${file}: ${error}`);
                    }
                }
            }
        }
        
        scheduleCronJobs(cronJobsToSchedule);
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