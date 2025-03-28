import { FollowRequest, GetCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (
  request: FollowRequest
): Promise<GetCountResponse> => {
  const userService = new UserService(new DynamoDBDaoFactory());
  const count = await userService.getFolloweeCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: count,
  };
};
