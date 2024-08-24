import axios from "axios";
import { GetCategoryHrefs } from "../category/categoryType";
import { ListTopicResponse, ProjectsData } from "./projectsType";
import * as fs from 'fs';
import * as path from 'path';
import { HTTPSTATUSOK, BASE_URL } from "../../../../const";

// ListAllProjectInCategory: to get all of the projects that exist in categories
// categories: can recieve from GetLinkCategory
// saveToFile?: optional for saving all of the projects into a file or not (default is false)
// url that need in ListAllProjectInCategory is already done in GetLinkCategory
export async function ListAllProjectInCategory(categories: GetCategoryHrefs[], saveToFile:boolean = false): Promise<ProjectsData[]> {
    const aggr: ProjectsData[] = [];

    for (const cate of categories) {
        let rounds: number = Math.ceil(cate.totalCount / 30);

        for (let i = 0; i < rounds; i++) {
            let rewriteUrl: string = cate.link;
            if (i !== 0) {
                rewriteUrl = `${cate.link}&page=${i}`;
            }

            try {
                const response = await axios.get<ListTopicResponse>(rewriteUrl);

                if (response.status !== HTTPSTATUSOK || response.data.topic_list.topics.length === 0) {
                    console.error(cate.display, " has a problem getting all of the project data");
                    continue;
                }

                const topics = response.data.topic_list.topics;

                topics.forEach((t) => {
                    const project: ProjectsData = {
                        id: t.id,
                        title: t.title,
                        excerpt: t.excerpt,
                        highest_post_number: t.highest_post_number,
                        views: t.views,
                        like_count: t.like_count,
                        posts_count: t.posts_count,
                        reply_count: t.reply_count,
                        has_summary: t.has_summary,
                        bumped_at: t.bumped_at,
                        created_at: t.created_at,
                        last_posted_at: t.last_posted_at,
                        category_id: t.category_id,
                        category: cate.display,
                        // * if want json format need to be in this format
                        link: BASE_URL + `/t/${t.id}.json?track_visit=false&forceLoad=true`,
                    };
                    aggr.push(project);
                });

            } catch (error) {
                console.error(`Error fetching data for ${cate.display}:`, error);
            }
        }
    }

    if (saveToFile){
        const folderName = path.join(__dirname, "data-projects");
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName, { recursive: true });
        }
    
        const filePath = path.join(folderName, 'data.json');
        fs.writeFileSync(filePath, JSON.stringify(aggr, null, 2), 'utf-8');
    
        console.log(`Data has been written to ${filePath}`);
    }
    return aggr;
}