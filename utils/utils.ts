import { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import cron from "node-cron";


export function chunkArray<T>(array: T[], size: number): T[][] {
    const chunkedArray: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size))
    }
    return chunkedArray
}

// parseArgs: for parsing arguement command
export function parseArgs(args: string[]): Record<string, string> {
    return args.reduce((acc, arg) => {
        const [key, value] = arg.split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);
}

// convertSpecialChar: currently just replace / with _ and replace : with +
export function convertSpecialChar(url: string): string {
    return url.replace(/\//g, '_').replace(/:/g, '+')
}

// headerGithub: getting the header option for axios
export function headerGithub() : (RawAxiosRequestHeaders) | AxiosHeaders| null  {

    if (!process.env.GITHUB_KEY || typeof(process.env.GITHUB_KEY) !== "string") {
        return null
    }

    if (process.env.GITHUB_KEY.length < 3){
        return null
    }

    const headers= { 
        "Accept": "application/vnd.github.v3+json",
        "Authorization": `Bearer ${process.env.GITHUB_KEY}`
    };
    return headers
}


// scheduleCronJobs use to schedule the cron jobs
export function scheduleCronJobs(cronJobsToSchedule:  { CRON_TIMER: string; Run: any; DATA_DIR: string }[]) {
    try {
        cronJobsToSchedule.forEach(job => {
            console.log(`Scheduling cron job for ${job.DATA_DIR} ${job.CRON_TIMER}`);
            cron.schedule(job.CRON_TIMER, () => {
                job.Run()
            }, {
                timezone: "America/Los_Angeles",
            });
        });
    } catch (error) {
        console.log("error when schedule the cron job", error)
    }
}