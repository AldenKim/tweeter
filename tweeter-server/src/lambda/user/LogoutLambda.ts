import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDaoFactory } from "../../daos/DynamoDBDaoFactory";

export const handler = async (
  request: LogoutRequest
): Promise<LogoutResponse> => {
  const userService = new UserService(new DynamoDBDaoFactory());
  await userService.logout(request.token);
  
  return {
    success: true,
    message: null,
  };
};