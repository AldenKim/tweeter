import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { FeedDao } from "./FeedDao";
import { DataPage } from "./entity/DataPage";
import { StatusHelper } from "./entity/StatusHelper";

export class DynamoDBFeedDao implements FeedDao {
  readonly tableName = "feed";
  readonly handleAttr = "handle";
  readonly timestampAttr = "timestamp";
  readonly postHandleAttr = "posthandle";
  readonly postAttr = "post";
  readonly client;

  public constructor(client: DynamoDBDocumentClient) {
    this.client = client;
  }

  public async addFeedItems(
    followers: string[],
    newStatus: StatusDto
  ): Promise<void> {
    for (const follower of followers) {
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

  public async getFeedPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<DataPage<StatusHelper>> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.handleAttr} = :handle`,
      ExpressionAttributeValues: {
        ":handle": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.handleAttr]: userAlias,
              [this.timestampAttr]: lastItem?.timestamp,
            },
      ScanIndexForward: false,
    };

    const items: StatusHelper[] = [];
    const data = await this.client.send(new QueryCommand(params));

    data.Items?.forEach((item) =>
      items.push(
        new StatusHelper(
          item[this.postHandleAttr],
          item[this.timestampAttr],
          item[this.postAttr]
        )
      )
    );

    const hasMorePages = data.LastEvaluatedKey !== undefined;

    return new DataPage<StatusHelper>(items, hasMorePages);
  }
}
