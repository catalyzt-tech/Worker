import * as path from "path";
import * as fs from "fs";

export async function Savefile(data: any, requiredPath: string[] = [], fileName: string) {
    try {
        // Use process.cwd() instead of __dirname to get the current working directory
        const folderName = path.join(process.cwd(), ...requiredPath)
       
        // Ensure the folder exists
        if (!fs.existsSync(folderName)) {
            console.log("folderName doesn't exist, creating...");
            try {
                fs.mkdirSync(folderName, { recursive: true });
            } catch (mkdirError) {
                console.error("Error creating directory:", mkdirError);
                throw new Error("Failed to create directory. Check permissions and path.");
            }
        }
    
        const filePath = path.join(folderName, fileName);
        
        // Use fs.writeFileSync for more robust file writing
        fs.writeFileSync(filePath, data, {encoding:"utf8", flag:"w"});

        console.log(`File successfully written to ${filePath}`);
    } catch (error) {
        console.error("An error occurred during the save file process:", error);
        throw error; // Re-throw the error for proper handling upstream
    }
}