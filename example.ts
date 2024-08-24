const MODULE_NAME = "MODULE_NAME"

const DATA_DIR = [ '..', '..', 'data', 'any-folder-name']

// cronTimer is the cron job timer for the module, it can be undefined if the module is not a cron job
// visit https://github.com/node-cron/node-cron to get the cron job timer
const cronTimer:string | undefined = undefined

async function Run() {
    console.log(`${MODULE_NAME} is starting . . .`);

    try {

        // TODO: add your scraper here that will save the data in DATA_DIR
        // await ProcessData(DATA_DIR);

    } catch (error) {
        console.error(`An error occurred during the ${MODULE_NAME} process:`, error);
        
    } finally {
        console.log(`${MODULE_NAME} process finished.`);
    }
}

export {Run, DATA_DIR, cronTimer}