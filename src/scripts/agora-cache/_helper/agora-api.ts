import axios, { AxiosError, AxiosResponse } from 'axios'
import { Response } from './agora-api-type'

// CallApiAgora: fetch a project base on limit and offset

const API_URL = 'https://vote.optimism.io/api/v1/retrofunding/rounds/5/projects'

async function CallApiAgora(limit: number, offset: number, authorizeKey: string): Promise<Response> {
  const url = `${API_URL}?limit=${limit}&offset=${offset}`
  try {
    const response: AxiosResponse<Response> = await axios.get(url, {
      maxBodyLength: Infinity,
      headers: { 
        'Authorization': `Bearer ${authorizeKey}`
      }
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        console.error(`API error: ${axiosError.response.status} - ${axiosError.response.statusText}`)
        throw new Error(`API error: ${axiosError.response.status} - ${axiosError.response.statusText}`)
      } else {
        console.error('Network error:', axiosError.message)
        throw new Error(`Network error: ${axiosError.message}`)
      }
    }
    console.error('Unexpected error:', error)
    throw error
  }
}

// GetAllProjects: fetch all the exist project until the has_next is false
export async function GetAllProjects(authorizeKey: string): Promise<Response[]> {
  let conditionBreak = false
  let limit = 100
  let offset = 0

  let datas: Response[] = []
  
  while (!conditionBreak) {
    try {
      const data = await CallApiAgora(limit, offset, authorizeKey)
      if (data){
        datas = datas.concat(data)
        if (data.meta.has_next) {
          offset += 100
        } else {
          conditionBreak = true
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  }

  return datas
}
