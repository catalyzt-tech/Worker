import { ALL_DOCS_PATH, BASE_DOC } from "../../../const";
import { ListAllFilesInGithub } from "../../../lib/list-all-files-github";
import { SaveFileMdxGithub } from "../../../lib/op-github/save-file-mdx-from-github";

const DATA_DIR = [ 'data', 'gov-doc-data']

// Which evaluates to 'At 0 seconds, 0 minutes every 1st hour'.
const CRON_TIMER:string | undefined = undefined

async function Run() {
    console.log("Gov Doc is starting . . .");

    try {
        let docs = await ListAllFilesInGithub(ALL_DOCS_PATH );
        if (!docs || docs.length === 0) {
            throw new Error("No docs data found");
        }
        await SaveFileMdxGithub(docs, DATA_DIR, BASE_DOC);

    } catch (error) {
        console.error("An error occurred during the Gov Doc process:", error);
        
    } finally {
        console.log("Gov Doc process finished.");
    }
}

export {Run, DATA_DIR, CRON_TIMER}