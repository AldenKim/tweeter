import { DataPage } from "./entity/DataPage";
import { Follow } from "./entity/Follow";

export interface FollowsDao {
  putFollow(follow: Follow): Promise<void>;
  getFollow(follow: Follow): Promise<Follow | undefined>;
  updateFollow(
    follow: Follow,
    newFollowerName: string,
    newFolloweeName: string
  ): Promise<void>;
  deleteFollow(follow: Follow): Promise<void>;
  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follow>>;
  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follow>>;
  getFollowersCount(followeeHandle: string): Promise<number>;
  getFolloweesCount(followerHandle: string): Promise<number>;
}
