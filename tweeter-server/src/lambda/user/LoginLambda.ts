import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userService = new UserService(new DynamoDBDaoFactory());
  const [user, authToken] =  await userService.login(request.alias, request.password);
  
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken
  };
};