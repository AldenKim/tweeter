import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { FollowsDao } from "../../daos/FollowsDao";
import { TokenService } from "./TokenService";
import { SessionsDao } from "../../daos/SessionsDao";
import { UsersDao } from "../../daos/UsersDao";

export class FollowService extends TokenService{
  private followsDao: FollowsDao;
  private sessionsDao: SessionsDao;
  private usersDao: UsersDao;

  public constructor(factory: DaoFactory) {
    super();
    this.followsDao = factory.createFollowsDao();
    this.sessionsDao = factory.createSessionsDao();
    this.usersDao = factory.createUsersDao();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(this.sessionsDao, token);

    const page = await this.followsDao.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);

    let userDtoList: UserDto[] = [];

    for(const item of page.values) {
      const user = await this.usersDao.getUser(item.follower_handle);
      if (user) {
        userDtoList.push(user);
      }
    }

    console.log(userDtoList.length);

    return [userDtoList, page.hasMorePages];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
