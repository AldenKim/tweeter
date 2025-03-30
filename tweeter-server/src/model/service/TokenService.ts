import { UserDto } from "tweeter-shared";
import { DataPage } from "../../daos/entity/DataPage";
import { Follow } from "../../daos/entity/Follow";
import { SessionsDao } from "../../daos/SessionsDao";
import { FollowsDao } from "../../daos/FollowsDao";
import { UsersDao } from "../../daos/UsersDao";

export abstract class TokenService {
  public async validateToken(sessionsDao: SessionsDao, token: string) {
    const auth_token = await sessionsDao.getSession(token);
    if (auth_token === null) {
      throw new Error("[Bad Request] Invalid Token");
    }
    await sessionsDao.checkTimeStampAndUpdate(auth_token);
  }

  public async followsPage(
    getPageFunctions: (userAlias: string, pageSize: number, lastItemAlias?: string) => Promise<DataPage<Follow>>,
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    usersDao: UsersDao,
    sessionsDao: SessionsDao,
    handleType: 'follower' | 'followee'
  ): Promise<[UserDto[], boolean]> {
    await this.validateToken(sessionsDao, token);

    const page = await getPageFunctions(userAlias, pageSize, lastItem?.alias);

    let userDtoList: UserDto[] = [];

    for (const item of page.values) {
      const handle = handleType === 'follower' ? item.follower_handle : item.followee_handle;
      const user = await usersDao.getUser(handle);
      if (user) {
        userDtoList.push(user);
      }
    }

    return [userDtoList, page.hasMorePages];
  }
}
