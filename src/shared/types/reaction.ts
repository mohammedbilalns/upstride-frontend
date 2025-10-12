type resourceType = "article" | "comment";
type reactionType = "like" | "dislike";

export interface ReactionMutationParams {
	resourceId: string;
	reaction: reactionType;
	resourceType: resourceType;
}
