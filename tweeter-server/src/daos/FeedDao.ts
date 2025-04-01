import { StatusDto } from "tweeter-shared";
import { DataPage } from "./entity/DataPage";
import { StatusHelper } from "./entity/StatusHelper";

export interface FeedDao {
  addFeedItems(followers: string[], newStatus: StatusDto): Promise<void>;
  getFeedPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<DataPage<StatusHelper>>;
}
