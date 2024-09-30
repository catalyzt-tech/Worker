import { Savefile } from "../../../lib/save-file/save-file"
import { GetAllProjects } from "./_helper/agora-api"

const DATA_DIR = ["data", "agora-cache"]
const FILENAME = "agora-cache.json"

// Schedule a task to run every 30 minutes
const CRON_TIMER: string | undefined = "*/30 * * * *"

async function Run() {
  console.log("Agora cache starting is starting . . .")
  try {

    const agoraKey = process.env.AGORA_KEY
    if (!agoraKey){
      throw new Error("Can't find agora key")
    }

    let projects = await GetAllProjects(agoraKey)
    if (!projects || projects.length === 0) {
      throw new Error("No projects data found")
    }
    await Savefile(JSON.stringify(projects), DATA_DIR, FILENAME)
    
  } catch (error) {
    console.error("An error occurred during the Agora cache starting process:", error)
  } finally {
    console.log("Agora cache starting process finished.")
  }
}

export { Run, DATA_DIR, CRON_TIMER }
