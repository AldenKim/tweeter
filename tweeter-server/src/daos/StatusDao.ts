import { StatusDto } from "tweeter-shared";
import { DataPage } from "./entity/DataPage";
import { StatusHelper } from "./entity/StatusHelper";

export interface StatusDao {
  postStatus(newStatus: StatusDto): Promise<void>;
  getStoryPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<DataPage<StatusHelper>>;
  getFeedPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
    peopleFollowed:string[]
  ): Promise<DataPage<StatusDto>>;
}
