import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDBDaoFactory } from "../../daos/factory/DynamoDBDaoFactory";

export const handler = async (event: any): Promise<void> => {
  const statusService = new StatusService(new DynamoDBDaoFactory());

  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const status: StatusDto = JSON.parse(body).status;
    const followers: string[] = JSON.parse(body).followers;
    console.log(
      "Posting status to Queue...",
      status.post,
      " Length:",
      event.Records.length
    );
    await statusService.addToFeed(status, followers);

    const startTimeMillis = new Date().getTime();
    const elapsedTime = new Date().getTime() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1000 - elapsedTime)
      );
    }
  }
};
