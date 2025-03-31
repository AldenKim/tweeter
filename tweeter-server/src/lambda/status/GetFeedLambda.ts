import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDBDaoFactory());
  const [items, hasMore] = await statusService.loadMoreFeedItems(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
