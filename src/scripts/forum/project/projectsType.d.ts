export interface ProjectsData {
    id:                    number;
    category:              string;
    title:                 string;
    posts_count:           number;
    reply_count:           number;
    highest_post_number:   number;
    created_at:            string;
    last_posted_at:        string;
    bumped_at:             string;
    excerpt:               string;
    views:                 number;
    like_count:            number;
    has_summary:           boolean;
    category_id: number;
    link: string;
}

export interface ListTopicResponse {
    users:          User[];
    primary_groups: PrimaryGroup[];
    flair_groups:   FlairGroup[];
    topic_list:     TopicList;
}

export interface FlairGroup {
    id:             number;
    name:           string;
    flair_url:      null | string;
    flair_bg_color: string;
    flair_color:    string;
}

export interface PrimaryGroup {
    id:   number;
    name: string;
}

export interface TopicList {
    can_create_topic: boolean;
    more_topics_url:  string;
    per_page:         number;
    top_tags:         string[];
    topics:           Topic[];
}

export interface Topic {
    id:                    number;
    title:                 string;
    fancy_title:           string;
    slug:                  string;
    posts_count:           number;
    reply_count:           number;
    highest_post_number:   number;
    image_url:             null | string;
    created_at:            string;
    last_posted_at:        string;
    bumped:                boolean;
    bumped_at:             string;
    archetype:             Archetype;
    unseen:                boolean;
    pinned:                boolean;
    unpinned:              null;
    excerpt:               string;
    visible:               boolean;
    closed:                boolean;
    archived:              boolean;
    bookmarked:            null;
    liked:                 null;
    tags:                  Tag[];
    tags_descriptions:     TagsDescriptions;
    views:                 number;
    like_count:            number;
    has_summary:           boolean;
    last_poster_username:  string;
    category_id:           number;
    pinned_globally:       boolean;
    featured_link:         null;
    has_accepted_answer:   boolean;
    can_vote:              boolean;
    posters:               Poster[];
    visibility_reason_id?: number;
}

export enum Archetype {
    Regular = "regular",
}

export interface Poster {
    extras:           Extras | null;
    description:      Description;
    user_id:          number;
    primary_group_id: number | null;
    flair_group_id:   number | null;
}

export enum Description {
    FrequentPoster = "Frequent Poster",
    MostRecentPoster = "Most Recent Poster",
    OriginalPoster = "Original Poster",
    OriginalPosterMostRecentPoster = "Original Poster, Most Recent Poster",
}

export enum Extras {
    Latest = "latest",
    LatestSingle = "latest single",
}

export enum Tag {
    Grants = "grants",
    Intent1 = "intent-1",
    Intent3B = "intent-3b",
    MissionRequest = "mission-request",
    S6MissionRequest = "s6-mission-request",
    Season6 = "season-6",
    TrustTiers = "trust-tiers",
}

export interface TagsDescriptions {
}

export interface User {
    id:                  number;
    username:            string;
    name:                null | string;
    avatar_template:     string;
    admin?:              boolean;
    moderator?:          boolean;
    trust_level:         number;
    primary_group_name?: string;
    flair_name?:         string;
    flair_url?:          string;
    flair_group_id?:     number;
}
