import axios from "axios";
import  { Buffer } from 'buffer';
import markdownToTxt from 'markdown-to-txt';
import { FilePathAndUrl } from "../list-all-files-github-type";
import { chunkArray, convertSpecialChar, headerGithub } from "../../utils/utils";
import { Savefile } from "../save-file/save-file";


export async function SaveFileMdxGithub(docs: FilePathAndUrl[], requiredPath: string[] = [], baseRefUrl:string) {

    try {
     
        const headers = headerGithub()
        if (headers === null){
            console.error("failed to get github key, put it on .env")
            return
        }
        
        const chunkSize = 50
        const chunkedDocs = chunkArray(docs, chunkSize)
    
        for (const docs of chunkedDocs){
            try {
                for (const doc of docs) {
                    
                    if(doc.path.includes("404.mdx") || doc.path.includes("500.mdx")){
                        continue
                    }
    
                    const response = await axios.get(doc.url, {
                        headers: headers
                    });
            
                    let content:string = "";
    
                    // decode encrypt content from github
                    const decodedContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
                    content = markdownToTxt(decodedContent)  
        
                    // doc.path will be something like pages/... so it using next router so the file name will be the route
                    const urlToSave = baseRefUrl + "/" + doc.path.replace("pages/", "").replace(".mdx", "")
                    const fileName = convertSpecialChar(urlToSave) + ".txt"
                    await Savefile(content, requiredPath, fileName)
    
                }
                setTimeout(() => {}, 500)
        
            } catch (error) {
                console.error('An error occured during process the data and saving the data:', error);
            }
        }
    } catch (error) {
        console.error("An error occurred during the SaveFileMdxGithub process:", error);
    }
}
