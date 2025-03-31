import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow } from "./entity/Follow";
import { DataPage } from "./entity/DataPage";

export class DynamoDBFollowsDao {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerAttr = "follower_handle";
  readonly followeeAttr = "followee_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeNameAttr = "followee_name";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async putFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: follow.follower_handle,
        [this.followerNameAttr]: follow.follower_name,
        [this.followeeAttr]: follow.followee_handle,
        [this.followeeNameAttr]: follow.followee_name,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  public async getFollow(follow: Follow): Promise<Follow | undefined> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follow.follower_handle,
        [this.followeeAttr]: follow.followee_handle,
      },
    };

    const output = await this.client.send(new GetCommand(params));

    return output.Item == undefined
      ? undefined
      : new Follow(
          output.Item[this.followerAttr],
          output.Item[this.followerNameAttr],
          output.Item[this.followeeAttr],
          output.Item[this.followeeNameAttr]
        );
  }

  public async updateFollow(
    follow: Follow,
    newFollowerName: string,
    newFolloweeName: string
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follow.follower_handle,
        [this.followeeAttr]: follow.followee_handle,
      },
      ExpressionAttributeValues: {
        ":fName": newFollowerName,
        ":feName": newFolloweeName,
      },
      UpdateExpression: "SET follower_name = :fName, followee_name = :feName",
    };
    await this.client.send(new UpdateCommand(params));
  }

  public async deleteFollow(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.followerAttr]: follow.follower_handle,
        [this.followeeAttr]: follow.followee_handle,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follow>> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAttr} = :followerHandle`,
      ExpressionAttributeValues: {
        ":followerHandle": followerHandle,
      },
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerAttr]: followerHandle,
              [this.followeeAttr]: lastFolloweeHandle,
            },
    };

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));

    data.Items?.forEach((item) =>
      items.push(
        new Follow(
          item[this.followerAttr],
          item[this.followerNameAttr],
          item[this.followeeAttr],
          item[this.followeeNameAttr]
        )
      )
    );

    const hasMorePages = data.LastEvaluatedKey !== undefined;
    return new DataPage<Follow>(items, hasMorePages);
  }

  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follow>> {
    const params: any = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: `${this.followeeAttr} = :followeeHandle`,
      ExpressionAttributeValues: {
        ":followeeHandle": followeeHandle,
      },
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followeeAttr]: followeeHandle,
              [this.followerAttr]: lastFollowerHandle,
            },
    };

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));

    data.Items?.forEach((item) =>
      items.push(
        new Follow(
          item[this.followerAttr],
          item[this.followerNameAttr],
          item[this.followeeAttr],
          item[this.followeeNameAttr]
        )
      )
    );

    const hasMorePages = data.LastEvaluatedKey !== undefined;
    return new DataPage<Follow>(items, hasMorePages);
  }

  public async getFolloweesCount(followerHandle: string): Promise<number> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.followerAttr} = :followerHandle`,
      ExpressionAttributeValues: {
        ":followerHandle": followerHandle,
      },
    };

    const data = await this.client.send(new QueryCommand(params));

    return data.Items ? data.Items.length : 0; 
  }

  public async getFollowersCount(followeeHandle: string): Promise<number> {
    const params: any = {
        TableName: this.tableName,
        IndexName: this.indexName,  
        KeyConditionExpression: `${this.followeeAttr} = :followeeHandle`, 
        ExpressionAttributeValues: {
          ":followeeHandle": followeeHandle,
        },
      };

    const data = await this.client.send(new QueryCommand(params));

    return data.Items ? data.Items.length : 0; 
  }
}
