import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const statusService = new StatusService(new DynamoDBDaoFactory());
  await statusService.postStatus(request.token, request.newStatus);

  return {
    success: true,
    message: null,
  };
};
