
export enum ReactionType  {
    LIKE = "LIKE",
    LOVE = "LOVE",
    HAHA = "HAHA",
    WOW = "WOW",
    SAD = "SAD",
    ANGRY = "ANGRY"
}

export type PostType = {
    _id?: string
    title: string,
    author_id: string,
    createdAt: Date,
    likes: any[],
    total_comments: number,
    total_likes: number,
    description: string,
}
