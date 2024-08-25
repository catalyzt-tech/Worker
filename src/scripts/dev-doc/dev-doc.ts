import { ALL_DOCS_DEV_PATH, BASE_DOC_DEV } from "../../../const";
import { ListAllFilesInGithub } from "../../../lib/list-all-files-github";
import { SaveFileMdxGithub } from "../../../lib/op-github/save-file-mdx-from-github";

const DATA_DIR = ['data', 'dev-doc-data']

// Which evaluates to 'At 0 seconds, 0 minutes every 1st hour'.
const CRON_TIMER:string | undefined = undefined

async function Run() {
    console.log("Dev Docs is starting . . .");
    try {
        let docs = await ListAllFilesInGithub(ALL_DOCS_DEV_PATH);
        if (!docs || docs.length === 0) {
            throw new Error("No dev docs data found");
        }

        await SaveFileMdxGithub(docs, DATA_DIR, BASE_DOC_DEV);

    } catch (error) {
        console.error("An error occurred during the Dev Docs process:", error);
    } finally {
        console.log("Dev Docs process finished.");
    }
}

export {Run, DATA_DIR, CRON_TIMER}