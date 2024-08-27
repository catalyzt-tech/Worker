import { SITEMAP_FORUM } from "../../../const"
import { chunkArray } from "../../../utils/utils"
import { SaveProjectData } from "./project/save-project-detail"
import { GetAllProjectsUrl } from "./sitemap/sitemap"

// * If sitemap doesn't gave all the result can scrape directly from the website
// console.log("on-process: 'getting all categories' . . .")
// const categoryHrefs = await GetLinkCategory(BASE_URL);
// if (categoryHrefs.length === 0){
//     console.error("Category Href link is empty array")
//     return
// }
// console.log("done: 'getting all categories' working-on: 'list all projects in each category' . . .")
// const projects = await ListAllProjectInCategory(categoryHrefs)
// console.log("done: 'list all projects in each category' working-on: 'get each project detail' . . .")


const DATA_DIR = ['data', 'forum-data']

// Which evaluates to 'At 0 seconds, 0 minutes every 1st hour'.
const CRON_TIMER:string | undefined = undefined
// const CRON_TIMER:string | undefined = "0 0 */1 * * *"

async function Run() {
    
    console.log("Forum is starting . . .")

    try {
        const urls = await GetAllProjectsUrl(SITEMAP_FORUM)
        if (!urls || urls.length === 0){
            throw new Error("No urls data found");
        }

        const chunkSize = 100
        const chunkedUrls = chunkArray(urls, chunkSize)

        for (const url of chunkedUrls) {
            await SaveProjectData(url, DATA_DIR)
            setTimeout(() => {}, 1000)
        }

    } catch (error) {
        console.error("An error occurred during the forum process:", error);
    } finally {
        console.log("Forum process finished.");
    }

}

export {DATA_DIR,  Run, CRON_TIMER}