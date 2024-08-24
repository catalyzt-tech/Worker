import * as cheerio from 'cheerio';
import axios from 'axios';
import { GetCategoryHrefs } from './categoryType';
import { BASE_URL } from '../../../../const';

// GetLinkCategory: to get all of the categories information
export async function GetLinkCategory(url: string): Promise<GetCategoryHrefs[]> {
    try {
      const response = await axios.get(url);
      const html = response.data;
  
      // Parse HTML
      const $ = cheerio.load(html);
  
      // get all link, display, totalCount
      const getCategoryData: GetCategoryHrefs[] = [];
      $('tr').each((index, element) => {
          
          // to get the correct url that we want to send
          const href = BASE_URL + $(element).find('.category a').attr('href') + "/l/latest.json?filter=default";
  
          // get category name
          const name = $(element).find('.category span[itemprop="name"]').text().trim();
  
          // get total category count
          const topics = parseInt($(element).find('.topics div').text().trim(), 10);
    
          if (href && name && !isNaN(topics)) {
              getCategoryData.push({ link:href, display:name, totalCount:topics });
          }
        });
  
      return getCategoryData;
  
    } catch (error) {
      console.error('Error scraping website:', error);
      return [];
    }
  }