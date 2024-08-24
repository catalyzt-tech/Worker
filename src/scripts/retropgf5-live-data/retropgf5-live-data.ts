import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client/core";
import fetch from "cross-fetch";
import axios from "axios";
import * as fs from 'fs'
import * as path from 'path'
const httpLink = new HttpLink({
    uri: "https://optimism.easscan.org/graphql",
    fetch: fetch,
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})

async function fetchMetadataSnapshot() {
    const query = gql`
query {
  attestations(where: {
    schemaId: {
      equals: "0x88b62595c76fbcd261710d0930b5f1cc2e56758e155dea537f82bf0baadd9a32"
    }
    timeCreated: {
      gte: 1724433829
    }
  }) {
    decodedDataJson
  }
}
`;
    try {
        const result = await client.query({
            query: query,
        });
        return result.data.attestations
            .map((attestation: any) => {
                return JSON.parse(attestation.decodedDataJson)
            })
            .map((subArray: any) => {
                const metadataSnapshot = subArray.find((item: any) => item.name === 'metadataSnapshotRefUID');
                return metadataSnapshot.value ?? null;
            })
            .map((metadataSnapshot: any) => metadataSnapshot.value)
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchMetadataURL(refUid: string) {
    const query = gql`query {
  attestations(where: {
    schemaId: {
      equals: "0xe035e3fe27a64c8d7291ae54c6e85676addcbc2d179224fe7fc1f7f05a8c6eac"
    }
    id: {
        equals: "${refUid}"
      }
  }) {
    decodedDataJson
  }
}`;
    try {
        const result = await client.query({
            query: query,
        });
        return result.data.attestations
            .map((attestation: any) => {
                return JSON.parse(attestation.decodedDataJson)
            })
            .map((subArray: any) => {
                const metadataURL = subArray.find((item: any) => item.name === 'metadataUrl');
                return metadataURL.value ?? null;
            })
            .map((metadataSnapshot: any) => metadataSnapshot.value)
    } catch (error) {
        console.error("Error fetching data:", error);
    }

}



async function fetchAndProcessData() {
    try {
        const data = await fetchMetadataSnapshot();
        const urlArrays = await Promise.all(data.map(async (d: string) => {
            const urls = await fetchMetadataURL(d);
            return urls;
        }));
        const concatenatedUrls = [].concat(...urlArrays);
        try {
            const responses = await Promise.all(concatenatedUrls.map(url => axios.get(url)));
            const dataArray = responses.map(response => response.data);
            return dataArray;
        } catch (error) {
            console.error("Error fetching project data:", error);
            return [];
        }
    } catch (error) {
        console.error("Error fetching metadata URLs:", error);
        return [];
    }
}

const DATA_DIR = [ '..', '..', '..', 'data', 'retropgf5-live-data']

// Which evaluates to 'At 0 seconds, 0 minutes every 1st hour'.
const cronTimer:string | undefined = "0 0 */1 * * *"

async function Run() {
    console.log("RetroPGF5 Live Data is starting . . .");

    try {
        const folderName = path.join(__dirname, ...DATA_DIR)

        // Ensure the folder exists
        if (!fs.existsSync(folderName)) {
            console.log("folderName don't exist, creating . . .")
            fs.mkdirSync(folderName, { recursive: true })
        }

        const dataArray = await fetchAndProcessData();
        const fileName = "retropgf5-live-data.json"
        const filePath = path.join(folderName, fileName)
        await fs.promises.writeFile(filePath, JSON.stringify(dataArray), 'utf-8');

    } catch (error) {
        console.error("An error occurred during the RetroPGF5 Live Data     process:", error);
        
    } finally {
        console.log("RetroPGF5 Live Data process finished.");
    }
}

export {Run, DATA_DIR, cronTimer}
