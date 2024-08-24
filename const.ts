
export const HTTPSTATUSOK = 200


// ============ FORUM ============

export const BASE_URL = 'https://gov.optimism.io';
// https://gov.optimism.io/t/8613.json?track_visit=true&forceLoad=true
// GetLinkCategory:             need https://gov.optimism.io
// ListAllProjectInCategory:    need https://gov.optimism.io/c/accountability/62/l/latest.json?filter=default&page=1
// but url that need in ListAllProjectInCategory is already done in GetLinkCategory
// sitemap https://gov.optimism.io/sitemap_1.xml
export const SITEMAP_FORUM = "https://gov.optimism.io/sitemap_1.xml"

// ============ END FORUM ============


// ============ USER DOCUMENTATION ============

export const ALL_DOCS_PATH = "https://api.github.com/repos/ethereum-optimism/community-hub/git/trees/main?recursive=1"
// to refer after we got the path in nextjs
export const BASE_DOC = "https://community.optimism.io"

// ============ END USER DOCUMENTATION ============



// ============ DEV DOCUMENTATION ============

export const ALL_DOCS_DEV_PATH = "https://api.github.com/repos/ethereum-optimism/docs/git/trees/main?recursive=1"
// to refer after we got the path in nextjs
export const BASE_DOC_DEV = "https://docs.optimism.io/"

// ============ END DEV DOCUMENTATION ============


// https://github.com/ethereum-optimism/docs/blob/main/pages/builders/cex-wallet-developers/cex-support.mdx
