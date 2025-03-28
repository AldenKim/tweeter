import { Buffer } from "buffer";
import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DaoFactory } from "../../daos/factory/DaoFactory";
import { UsersDao } from "../../daos/UsersDao";
import { SessionsDao } from "../../daos/SessionsDao";
import { S3DaoInterface } from "../../daos/S3DaoInterface";
import * as bcrypt from "bcryptjs";

export class UserService {
  private readonly usersDao: UsersDao;
  private readonly sessionsDao: SessionsDao;
  private readonly s3Dao: S3DaoInterface;

  public constructor(factory: DaoFactory) {
    this.usersDao = factory.createUsersDao();
    this.sessionsDao = factory.createSessionsDao();
    this.s3Dao = factory.createS3Dao();
  }

  public async logout(authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
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

    if(!check) {
      throw new Error("[Bad Request] Invalid password");
    }

    const auth_token = await this.sessionsDao.createSession();

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

    // TODO: Replace with the result of calling the server
    if (await this.usersDao.getUser(alias) !== null) {
      throw new Error("[Bad Request] user alias already taken");
    }

    const imageUrl = await this.s3Dao.putImage(imageFileExtension, userImageBytes);

    const salt = await bcrypt.genSalt();
    const hash = bcrypt.hashSync(password, salt);

    const user = await this.usersDao.addUser(new User(firstName, lastName, alias, imageUrl), hash); 

    if (user === null) {
      throw new Error("[Bad Request] Invalid registration");
    }

    const auth_token = await this.sessionsDao.createSession();

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
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      token,
      userToUnfollow
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToUnfollow
    );

    return [followerCount, followeeCount];
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }
}

