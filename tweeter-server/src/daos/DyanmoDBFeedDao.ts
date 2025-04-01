import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { FeedDao } from "./FeedDao";

export class DynamoDBFeedDao implements FeedDao {
  readonly tableName = "feed";
  readonly handleAttr = "handle";
  readonly timestampAttr = "timestamp";
  readonly postHandleAttr = "posthandle";
  readonly postAttr = "post";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async addFeedItems(
    followers: string[],
    newStatus: StatusDto
  ): Promise<void> {
    for (const follower in followers) {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.handleAttr]: follower,
          [this.timestampAttr]: newStatus.timestamp,
          [this.postHandleAttr]: newStatus.user.alias,
          [this.postAttr]: newStatus.post,
        },
      };
      await this.client.send(new PutCommand(params));
    }
  }
}
