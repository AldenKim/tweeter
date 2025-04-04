import { Buffer } from "buffer";
import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  User,
  UserDto,
} from "tweeter-shared";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { UsersDao } from "../../daos/UsersDao";
import { SessionsDao } from "../../daos/SessionsDao";
import { S3DaoInterface } from "../../daos/S3DaoInterface";
import * as bcrypt from "bcryptjs";
import { TokenService } from "./TokenService";
import { FollowsDao } from "../../daos/FollowsDao";
import { Follow } from "../../daos/entity/Follow";

export class UserService extends TokenService {
  private readonly usersDao: UsersDao;
  private readonly sessionsDao: SessionsDao;
  private readonly s3Dao: S3DaoInterface;
  private readonly followsDao: FollowsDao;

  public constructor(factory: DaoFactory) {
    super();
    this.usersDao = factory.createUsersDao();
    this.sessionsDao = factory.createSessionsDao();
    this.s3Dao = factory.createS3Dao();
    this.followsDao = factory.createFollowsDao();
  }

  public async logout(authToken: string): Promise<void> {
    try {
      await this.sessionsDao.deleteSession(authToken);
    } catch (error) {
      console.error("Failed to delete session:", error);
      throw new Error("[Server Error] Could not log out");
    }
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = await this.usersDao.getUser(alias);

    if (user === null) {
      throw new Error("[Bad Request] Invalid alias");
    }

    const stored_password = await this.usersDao.getPassword(alias);

    if (stored_password === null) {
      throw new Error("[Bad Request] Stored password not retrieved");
    }

    const check = await bcrypt.compare(password, stored_password);

    if (!check) {
      throw new Error("[Bad Request] Invalid password");
    }

    await this.sessionsDao.cleanExpiredSessions();

    const auth_token = await this.sessionsDao.createSession(alias);

    if (auth_token === null) {
      throw new Error("[Bad Request] AuthToken not generated");
    }

    return [user, auth_token];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    if ((await this.usersDao.getUser(alias)) !== null) {
      throw new Error("[Bad Request] user alias already taken");
    }

    const imageUrl = await this.s3Dao.putImage(
      alias + "." + imageFileExtension,
      userImageBytes
    );

    const salt = await bcrypt.genSalt();
    const hash = bcrypt.hashSync(password, salt);

    const user = await this.usersDao.addUser(
      new User(firstName, lastName, alias, imageUrl),
      hash
    );

    if (user === null) {
      throw new Error("[Bad Request] Invalid registration");
    }

    await this.sessionsDao.cleanExpiredSessions();

    const auth_token = await this.sessionsDao.createSession(alias);

    if (auth_token === null) {
      throw new Error("[Bad Request] AuthToken not generated");
    }

    return [user, auth_token];
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    try {
      const check = await this.followsDao.getFollow(
        new Follow(user.alias, "", selectedUser.alias, "")
      );

      return check ? true : false;
    } catch (error) {
      throw new Error("[Server Error] unable to get follower status");
    }
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    try {
      await this.validateToken(this.sessionsDao, token);

      return await this.usersDao.getFolloweesCount(user.alias);
    } catch (error) {
      throw new Error("[Server Error] unable to get followee count");
    }
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    try {
      await this.validateToken(this.sessionsDao, token);

      return await this.usersDao.getFollowersCount(user.alias);
    } catch (error) {
      throw new Error("[Server Error] unable to get follower count");
    }
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.validateToken(this.sessionsDao, token);
    try {
      const userAlias = await this.sessionsDao.getHandleBySession(token);

      await this.followsDao.putFollow(
        new Follow(userAlias, "", userToFollow.alias, "")
      );

      await this.usersDao.incrementFolloweesCount(userAlias);
      await this.usersDao.incrementFollowersCount(userToFollow.alias);

      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    } catch (error) {
      throw new Error("[Server Error] unable to follower user");
    }
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.validateToken(this.sessionsDao, token);
    try {
      const userAlias = await this.sessionsDao.getHandleBySession(token);

      await this.followsDao.deleteFollow(
        new Follow(userAlias, "", userToUnfollow.alias, "")
      );

      await this.usersDao.decrementFolloweesCount(userAlias);
      await this.usersDao.decrementFollowersCount(userToUnfollow.alias);

      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

      return [followerCount, followeeCount];
    } catch (error) {
      throw new Error("[Server Error] unable to unfollow user");
    }
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.validateToken(this.sessionsDao, token);

    const user = await this.usersDao.getUser(alias);
    return user ? user : null;
  }
  //All pages
}
