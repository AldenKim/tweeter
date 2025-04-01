import { StatusDto } from "tweeter-shared";

export interface FeedDao {
    addFeedItems(followers: string[], newStatus: StatusDto): Promise<void>;
}