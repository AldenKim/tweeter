import { Status, FakeData, StatusDto, User } from "tweeter-shared";
import { TokenService } from "./TokenService";
import { SessionsDao } from "../../daos/SessionsDao";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { StatusDao } from "../../daos/StatusDao";
import { UsersDao } from "../../daos/UsersDao";

export class StatusService extends TokenService {
  private readonly sessionsDao: SessionsDao;
  private readonly statusDao: StatusDao;
  private readonly usersDao: UsersDao;

  public constructor(factory: DaoFactory) {
    super();
    this.sessionsDao = factory.createSessionsDao();
    this.statusDao = factory.createStatusDao();
    this.usersDao = factory.createUsersDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
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

    try {
      await this.statusDao.postStatus(newStatus);
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
