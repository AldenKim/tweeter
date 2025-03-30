import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { FollowsDao } from "../../daos/FollowsDao";
import { TokenService } from "./TokenService";
import { SessionsDao } from "../../daos/SessionsDao";
import { UsersDao } from "../../daos/UsersDao";

export class FollowService extends TokenService {
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
    return await this.followsPage(
      (alias, size, last) => this.followsDao.getPageOfFollowers(alias, size, last),
      token,
      userAlias,
      pageSize,
      lastItem,
      this.usersDao,
      this.sessionsDao,
      'follower'
    );
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.followsPage(
      (alias, size, last) => this.followsDao.getPageOfFollowees(alias, size, last),
      token,
      userAlias,
      pageSize,
      lastItem,
      this.usersDao,
      this.sessionsDao,
      'followee'
    );
  }
}
