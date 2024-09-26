export interface Response {
    meta: Meta;
    data: any;
}

export interface Meta {
    has_next:       boolean;
    total_returned: number;
    next_offset:    number;
}
