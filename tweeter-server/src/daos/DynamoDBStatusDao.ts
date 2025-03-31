import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { StatusDao } from "./StatusDao";
import { DataPage } from "./entity/DataPage";
import { StatusHelper } from "./entity/StatusHelper";

export class DyanmoDBStatusDao implements StatusDao {
  readonly tableName = "status";
  readonly handleAttr = "handle";
  readonly timestampAttr = "timestamp";
  readonly postAttr = "post";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async postStatus(newStatus: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.handleAttr]: newStatus.user.alias,
        [this.timestampAttr]: newStatus.timestamp,
        [this.postAttr]: newStatus.post,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getStoryPage(
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
        lastItem === undefined
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
          item[this.handleAttr],
          item[this.timestampAttr],
          item[this.postAttr]
        )
      )
    );

    const hasMorePages = data.LastEvaluatedKey !== undefined;

    return new DataPage<StatusHelper>(items, hasMorePages);
  }

  /*public async getFeedPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<DataPage<StatusDto>> {
    
  }*/
}
