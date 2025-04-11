import { Status, FakeData, StatusDto, User } from "tweeter-shared";
import { TokenService } from "./TokenService";
import { SessionsDao } from "../../daos/SessionsDao";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { StatusDao } from "../../daos/StatusDao";
import { UsersDao } from "../../daos/UsersDao";
import { FollowsDao } from "../../daos/FollowsDao";
import { FeedDao } from "../../daos/FeedDao";
import { SqsClient } from "../../sqs/SqsClient";

export class StatusService extends TokenService {
  private readonly sessionsDao: SessionsDao;
  private readonly statusDao: StatusDao;
  private readonly usersDao: UsersDao;
  private readonly followsDao: FollowsDao;
  private readonly feedDao: FeedDao;

  public constructor(factory: DaoFactory) {
    super();
    this.sessionsDao = factory.createSessionsDao();
    this.statusDao = factory.createStatusDao();
    this.usersDao = factory.createUsersDao();
    this.followsDao = factory.createFollowsDao();
    this.feedDao = factory.createFeedDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.validateToken(this.sessionsDao, token);
    
    const page = await this.feedDao.getFeedPage(userAlias, pageSize, lastItem);
    
    let statusDtoList: StatusDto[] = [];

    for (const item of page.values) {
      const user = await this.usersDao.getUser(item.handle);
      const converter = User.fromDto(user);
      if (converter) {
        statusDtoList.push(new Status(item.post, converter, item.timestamp).dto);
      }
    }

    return [statusDtoList, page.hasMorePages];
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

    const sqsClient = new SqsClient("https://sqs.us-west-2.amazonaws.com/905418091492/PostStatusQueue");

    try {
      await this.statusDao.postStatus(newStatus);

      await sqsClient.sendMessage(JSON.stringify(newStatus))

      /*const followers = await this.followsDao.getFollowers(user);
      await this.feedDao.addFeedItems(followers, newStatus);*/
    } catch (error) {
      console.error("DynamoDB PutCommand Error:", error);
      throw new Error("[Server Error] unable to post status");
    }
  }

  public async postToFeedQueue(status: StatusDto) {
    const alias = status.user.alias;

    let lastFollowerHandle = undefined;
    let followers: string[] = [];
    let hasMore: boolean = true;

    const sqsClient = new SqsClient("https://sqs.us-west-2.amazonaws.com/905418091492/UpdateFeedQueue");
    
    while(hasMore) {
        [followers, hasMore] = await this.followsDao.getFollowersSQS(alias, 100, lastFollowerHandle);
        
        lastFollowerHandle = followers[followers.length - 1];

        const postToFeedItem = {
          status,
          followers
        }

        await sqsClient.sendMessage(JSON.stringify(postToFeedItem));
    }
  }

  public async addToFeed(newStatus: StatusDto, followers: string[]) {
    await this.feedDao.addFeedItems(followers, newStatus);
  }
}
