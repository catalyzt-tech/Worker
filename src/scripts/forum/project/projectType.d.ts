
export interface ProjectJSON {
    title:                                string;
    // in json data key is "cooked"
    content: string;
    views: number;
    like_count: number;
    word_count: number;
    answer: Answer[];
    created_at: string;

}

export interface Answer {
    username: string;
    content: string;
    created_at: string;
    trust_level: number
    moderator: boolean;
    admin: boolean;
    staff: boolean;
    like_count: number;
}

export interface GetProjectDetailExample {
    post_stream:                          PostStream;
    timeline_lookup:                      Array<number[]>;
    suggested_topics:                     any[];
    tags:                                 any[];
    tags_descriptions:                    TagsDescriptions;
    id:                                   number;
    title:                                string;
    fancy_title:                          string;
    posts_count:                          number;
    created_at:                           string;
    views:                                number;
    reply_count:                          number;
    like_count:                           number;
    last_posted_at:                       string;
    visible:                              boolean;
    closed:                               boolean;
    archived:                             boolean;
    has_summary:                          boolean;
    archetype:                            string;
    slug:                                 Slug;
    category_id:                          number;
    word_count:                           number;
    deleted_at:                           null;
    user_id:                              number;
    featured_link:                        null;
    pinned_globally:                      boolean;
    pinned_at:                            null;
    pinned_until:                         null;
    image_url:                            null;
    slow_mode_seconds:                    number;
    visibility_reason_id:                 number;
    draft:                                null;
    draft_key:                            string;
    draft_sequence:                       null;
    unpinned:                             null;
    pinned:                               boolean;
    current_post_number:                  number;
    highest_post_number:                  number;
    deleted_by:                           null;
    actions_summary:                      GetProjectDetailExampleActionsSummary[];
    chunk_size:                           number;
    bookmarked:                           boolean;
    topic_timer:                          null;
    message_bus_last_id:                  number;
    participant_count:                    number;
    show_read_indicator:                  boolean;
    thumbnails:                           null;
    slow_mode_enabled_until:              null;
    tags_disable_ads:                     boolean;
    related_topics:                       RelatedTopic[];
    summarizable:                         boolean;
    can_vote:                             boolean;
    vote_count:                           number;
    user_voted:                           boolean;
    discourse_zendesk_plugin_zendesk_id:  null;
    discourse_zendesk_plugin_zendesk_url: string;
    details:                              Details;
    bookmarks:                            any[];
}

export interface GetProjectDetailExampleActionsSummary {
    id:      number;
    count:   number;
    hidden:  boolean;
    can_act: boolean;
}

export interface Details {
    can_edit:           boolean;
    notification_level: number;
    participants:       Participant[];
    created_by:         CreatedBy;
    last_poster:        CreatedBy;
    links:              Link[];
}

export interface CreatedBy {
    id?:             number;
    username:        string;
    name:            string;
    avatar_template: string;
}

export interface Link {
    url:         string;
    title:       null | string;
    internal:    boolean;
    attachment:  boolean;
    reflection:  boolean;
    clicks:      number;
    user_id:     number;
    domain:      string;
    root_domain: string;
}

export interface Participant {
    id:                 number;
    username:           string;
    name:               string;
    avatar_template:    string;
    post_count:         number;
    primary_group_name: null;
    flair_name:         null;
    flair_url:          null;
    flair_color:        null;
    flair_bg_color:     null;
    flair_group_id:     null;
    trust_level:        number;
    admin?:             boolean;
    moderator?:         boolean;
}

export interface PostStream {
    posts:  Post[];
    stream: number[];
}

export interface Post {
    id:                    number;
    name:                  string;
    username:              string;
    avatar_template:       string;
    created_at:            string;
    cooked:                string;
    post_number:           number;
    post_type:             number;
    updated_at:            string;
    reply_count:           number;
    reply_to_post_number:  number | null;
    quote_count:           number;
    incoming_link_count:   number;
    reads:                 number;
    readers_count:         number;
    score:                 number;
    yours:                 boolean;
    topic_id:              number;
    topic_slug:            Slug;
    display_username:      string;
    primary_group_name:    null;
    flair_name:            null;
    flair_url:             null;
    flair_bg_color:        null;
    flair_color:           null;
    flair_group_id:        null;
    version:               number;
    can_edit:              boolean;
    can_delete:            boolean;
    can_recover:           boolean;
    can_see_hidden_post:   boolean;
    can_wiki:              boolean;
    link_counts?:          LinkCount[];
    read:                  boolean;
    user_title:            null | string;
    bookmarked:            boolean;
    actions_summary:       PostActionsSummary[];
    moderator:             boolean;
    admin:                 boolean;
    staff:                 boolean;
    user_id:               number;
    hidden:                boolean;
    trust_level:           number;
    deleted_at:            null;
    user_deleted:          boolean;
    edit_reason:           null | string;
    can_view_edit_history: boolean;
    wiki:                  boolean;
    can_accept_answer:     boolean;
    can_unaccept_answer:   boolean;
    accepted_answer:       boolean;
    topic_accepted_answer: boolean;
    can_vote?:             boolean;
    action_code?:          string;
    reply_to_user?:        CreatedBy;
}

export interface PostActionsSummary {
    id:    number;
    count: number;
}

export interface LinkCount {
    url:        string;
    internal:   boolean;
    reflection: boolean;
    title?:     string;
    clicks:     number;
}

export enum Slug {
    RetroFunding5ExpertVotingExperiment = "retro-funding-5-expert-voting-experiment",
}

export interface RelatedTopic {
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
    archetype:             string;
    unseen:                boolean;
    pinned:                boolean;
    unpinned:              null;
    excerpt:               string;
    visible:               boolean;
    closed:                boolean;
    archived:              boolean;
    bookmarked:            null;
    liked:                 null;
    visibility_reason_id?: number;
    tags:                  string[];
    tags_descriptions:     TagsDescriptions;
    like_count:            number;
    views:                 number;
    category_id:           number;
    featured_link:         null;
    has_accepted_answer:   boolean;
    posters:               Poster[];
}

export interface Poster {
    extras:      null | string;
    description: Description;
    user:        User;
}

export enum Description {
    FrequentPoster = "Frequent Poster",
    MostRecentPoster = "Most Recent Poster",
    OriginalPoster = "Original Poster",
    OriginalPosterMostRecentPoster = "Original Poster, Most Recent Poster",
}

export interface User {
    id:              number;
    username:        string;
    name:            string;
    avatar_template: string;
    admin?:          boolean;
    moderator?:      boolean;
    trust_level:     number;
}

export interface TagsDescriptions {
}
