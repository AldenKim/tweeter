import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (event: any): Promise<void> => {
    const status: StatusDto = JSON.parse(event.Records[0].body);
    console.log("PostUpdateFeedLambda Triggered...");
    console.log(status);
    const statusService = new StatusService(new DynamoDBDaoFactory());
    await statusService.postToFeedQueue(status);
};