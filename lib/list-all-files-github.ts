
import axios from "axios"
import { headerGithub } from "../utils/utils"
import { FilePathAndUrl, ListGithubFilesResponse } from "./list-all-files-github-type"

// ListAllFileInDocs: will return a all of url (navigate to get encrypt content) and path (where is the file in the repo ex./pages/...)
// includeString is optional we will use it with path like path.includes(includeString)
// by default it will only include .mdx file
export async function ListAllFilesInGithub(githubRepoLink:string, includeString:string = ".mdx"): Promise<FilePathAndUrl[]> {

    try {
        let allUrlPath:FilePathAndUrl[] = []

        const headers = headerGithub()
        if (headers === null){
            console.error("failed to get github key, put it on .env")
            return []
        }
        
        const response = await axios.get<ListGithubFilesResponse>(githubRepoLink, {
            headers: headers,
        })
        
        if (response.status !== 200 || response.data.tree.length === 0){
            console.error("failed to list all document path data")
            return []
        }

        for (const res of response.data.tree){
            if(res.path.includes(includeString)){
                let doc: FilePathAndUrl = {
                    path: res.path,
                    url: res.url,
                }
                allUrlPath.push(doc)
            }
        }

        return allUrlPath     
    } catch (error) {
        console.error("failed to list all file in docs", error)
        return []
    }

}