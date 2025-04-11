import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (status: StatusDto, followers: string[]): Promise<void> => {

    console.log("PostUpdateFeedLambda Triggered...");
    const statusService = new StatusService(new DynamoDBDaoFactory());
    await statusService.addToFeed(status, followers);
};