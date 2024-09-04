import { ApolloClient, gql, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client/core";
import fetch from "cross-fetch";
import axios from "axios";
import { Savefile } from "../../../lib/save-file/save-file";

function createApolloClient() {
    const httpLink = new HttpLink({
        uri: "https://optimism.easscan.org/graphql",
        fetch: fetch,
    });

    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({
            resultCaching: false,
        }),
        defaultOptions: {
            query: {
                fetchPolicy: 'network-only',
            },
            watchQuery: {
                fetchPolicy: 'network-only',
            },
        },
    });
}

async function fetchMetadataSnapshot(client: ApolloClient<NormalizedCacheObject>) {

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

async function fetchMetadataURL(refUid: string, client: ApolloClient<NormalizedCacheObject>) {
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
                const projectRefUid = subArray.find((item: any) => item.name === 'projectRefUID');
                const metadataURL = subArray.find((item: any) => item.name === 'metadataUrl');

                return {
                    metadataURL: metadataURL.value.value,
                    projectRefUid: projectRefUid.value.value
                };
            })
    } catch (error) {
        console.error("Error fetching data:", error);
    }

}



export async function fetchAndProcessData(client: ApolloClient<NormalizedCacheObject>) {
    console.log("Fetching and processing data . . .");
    try {
        const data = await fetchMetadataSnapshot(client);
        const urlArrays = await Promise.all(data.map(async (d: string) => {
            const urls = await fetchMetadataURL(d, client);
            return urls;
        }));
        const concatenatedUrls = [].concat(...urlArrays);

        try {
            const responses: any[] = [];
            await Promise.all(concatenatedUrls.map(async (url) => {
                try {
                    const response = await axios.get(url.metadataURL);
                    let concatData = response.data;
                    concatData["projectUid"] = url.projectRefUid;
                    responses.push(concatData);
                } catch (error) {
                    console.error("Error fetching project data from metadataURL:", error);
                }
            }));
            client.stop()
            return responses;
        } catch (error) {
            console.error("Error fetching project data:", error);
            return [];
        }
    } catch (error) {
        console.error("Error fetching metadata URLs:", error);
        return [];
    }
}

const DATA_DIR = ['data', 'retropgf5-live-data']

// Which evaluates to 'At 0 seconds, 0 minutes every 1st hour'.
// const CRON_TIMER: string | undefined = "*/1 * * * *";
const CRON_TIMER: string | undefined = "0 0 */1 * * *"
// const CRON_TIMER:string | undefined = undefined

async function Run() {
    console.log("RetroPGF5 Live Data is starting . . .");
    const fileName = "retropgf5-live-data.json"

    try {
        const client = createApolloClient();
        const dataArray = await fetchAndProcessData(client);
        // const dataArray: any[] = []
        await Savefile(JSON.stringify(dataArray), DATA_DIR, fileName)
        // console.log("save retropgf5 \n", dataArray)

    } catch (error) {
        console.error("An error occurred during the RetroPGF5 Live Data process:", error);

    } finally {
        console.log("RetroPGF5 Live Data process finished.");
    }
}
export {Run, DATA_DIR, CRON_TIMER}