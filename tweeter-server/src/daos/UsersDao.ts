import { User, UserDto } from "tweeter-shared";

export interface UsersDao {
  getUser(handle: string): Promise<UserDto | null>;
  addUser(newUser: User, password: string): Promise<UserDto | null>;
  getPassword(handle: string): Promise<string | null>;
  getFollowersCount(followeeHandle: string): Promise<number>;
  getFolloweesCount(followerHandle: string): Promise<number>;
  incrementFollowersCount(followeeHandle: string): Promise<void>;
  incrementFolloweesCount(followerHandle: string): Promise<void>;
  decrementFollowersCount(followeeHandle: string): Promise<void>;
  decrementFolloweesCount(followerHandle: string): Promise<void>;
}
