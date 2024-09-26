import axios, { AxiosResponse } from 'axios';
import { Response } from './agora-api-type'


// CallApiAgora: fetch a project base on limit and offset
async function CallApiAgora(limit: number, offset: number, authorizeKey: string): Promise<Response | undefined> {
  const url = `https://vote.optimism.io/api/v1/retrofunding/rounds/5/projects?limit=${limit}&offset=${offset}`;
  try {
    const response: AxiosResponse<Response> = await axios.get(url, {
      maxBodyLength: Infinity,
      headers: { 
        'Authorization': `Bearer ${authorizeKey}`
      }
    });
    if (response.status === 200){
      return response.data as Response;
    } else {
      return undefined
    }

  } catch (error) {
    console.error('Failed to fetch project data:', error);
    throw error;
  }
}

// GetAllProjects: fetch all the exist project until the has_next is false
export async function GetAllProjects(authorizeKey: string): Promise<Response[]> {
  let conditionBreak = false;
  let limit = 100;
  let offset = 0;

  let datas: Response[] = [];
  
  while (!conditionBreak) {
    try {
      const data = await CallApiAgora(limit, offset, authorizeKey);
      if (data){
        datas = datas.concat(data);
        if (data.meta.has_next) {
          offset += 100;
        } else {
          conditionBreak = true;
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  return datas;
}
