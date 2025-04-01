import { Status, FakeData, StatusDto, User } from "tweeter-shared";
import { TokenService } from "./TokenService";
import { SessionsDao } from "../../daos/SessionsDao";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { StatusDao } from "../../daos/StatusDao";
import { UsersDao } from "../../daos/UsersDao";
import { FollowsDao } from "../../daos/FollowsDao";

export class StatusService extends TokenService {
  private readonly sessionsDao: SessionsDao;
  private readonly statusDao: StatusDao;
  private readonly usersDao: UsersDao;
  private readonly followsDao: FollowsDao;

  public constructor(factory: DaoFactory) {
    super();
    this.sessionsDao = factory.createSessionsDao();
    this.statusDao = factory.createStatusDao();
    this.usersDao = factory.createUsersDao();
    this.followsDao = factory.createFollowsDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.validateToken(this.sessionsDao, token);
    

    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.validateToken(this.sessionsDao, token);

    const page = await this.statusDao.getStoryPage(userAlias, pageSize, lastItem);
    const user = await this.usersDao.getUser(userAlias);

    let statusDtoList: StatusDto[] = [];

    for (const item of page.values) {
      const converter = User.fromDto(user);
      if (converter) {
        statusDtoList.push(new Status(item.post, converter, item.timestamp).dto);
      }
    }

    return [statusDtoList, page.hasMorePages];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.validateToken(this.sessionsDao, token);
    const user = await this.sessionsDao.getHandleBySession(token);

    try {
      await this.statusDao.postStatus(newStatus);
      const followers = await this.followsDao.getFollowers(user);
      
      
    } catch (error) {
      console.error("DynamoDB PutCommand Error:", error);
      throw new Error("[Server Error] unable to post status");
    }
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
