import { SessionsDao } from "../../daos/SessionsDao";

export abstract class TokenService {
  public async validateToken(sessionsDao: SessionsDao, token: string) {
    const auth_token = await sessionsDao.getSession(token);
    if (auth_token === null) {
      throw new Error("[Bad Request] Invalid Token");
    }
    await sessionsDao.checkTimeStampAndUpdate(auth_token);
  }
}
