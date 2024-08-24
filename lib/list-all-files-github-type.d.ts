export interface FilePathAndUrl {
    path: string;
    url: string;
}

export interface ListGithubFilesResponse {
    sha:  string;
    url:  string;
    tree: Tree[];
}

export interface Tree {
    path:  string;
    mode:  string;
    type:  string;
    sha:   string;
    size?: number;
    url:   string;
}
