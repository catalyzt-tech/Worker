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

async function ipfsResolver(ipfsUrl: string) {
    try {
        const response = await axios.get(ipfsUrl);
        return response.data;
    } catch (error) {
        console.error("Error fetching data from IPFS:", error);
        return null;
    }
}

// Scheme 609: Retro Funding 6 Application
async function fetchMetadataSnapshot(client: ApolloClient<NormalizedCacheObject>) {
    const query = gql`
query {
  attestations(where: {
    schemaId: {
      equals: "0x2169b74bfcb5d10a6616bbc8931dc1c56f8d1c305319a9eeca77623a991d4b80"
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

        const attestations = result.data.attestations.map((attestation: any) => {
            return JSON.parse(attestation.decodedDataJson);
        });

        const metadataSnapshots = await Promise.all(attestations.map(async (subArray: any) => {
            const metadataSnapshot = subArray.find((item: any) => item.name === 'metadataSnapshotRefUID');
            const impactIpfsUrl = subArray.find((item: any) => item.name === 'metadataUrl');
            const impactIpfs = await ipfsResolver(impactIpfsUrl.value.value ?? null);
            return {
                projectRefUid: metadataSnapshot.value.value ?? null,
                impactIpfs: impactIpfs
            };
        }));

        return metadataSnapshots;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
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
        
        const uidArray = data.map((d: any) => d.projectRefUid);
        

        const arrObjectSomething = await Promise.all(data.map(async (d: object) => {
            //@ts-ignore
            const urls = await fetchMetadataURL(d.projectRefUid, client);
            return {
                ipfsUrl: urls,
                //@ts-ignore
                impactIpfs: d.impactIpfs,
                //@ts-ignore
                projectRefUid: d.projectRefUid,
            };
        }));

        // console.log("data", arrObjectSomething[0].ipfsUrl)   

        try {
            const responses: any[] = [];
            await Promise.all(arrObjectSomething.map(async (url) => {
                try {
                    const response = await axios.get(url.ipfsUrl[0].metadataURL);
                    let concatData = response.data;
                    concatData["projectUid"] = url.projectRefUid;
                    concatData["impactIpfs"] = url.impactIpfs;

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

const DATA_DIR = ['data', 'retropgf6-live-data']

// Which evaluates to 'At 0 seconds, 0 minutes every 1st hour'.
const CRON_TIMER: string | undefined = "0 0 */1 * * *"

async function Run() {
    console.log("RetroPGF6 Live Data is starting . . .");
    const fileName = "retropgf6-live-data.json"

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

export { Run, DATA_DIR, CRON_TIMER }
// Run()