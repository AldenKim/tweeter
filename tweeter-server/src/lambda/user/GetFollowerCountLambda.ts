import { FollowRequest, GetCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FollowRequest
): Promise<GetCountResponse> => {
  const userService = new UserService();
  const count = await userService.getFollowerCount(request.token, request.user);

  return {
    success: true,
    message: null,
    count: count,
  };
};