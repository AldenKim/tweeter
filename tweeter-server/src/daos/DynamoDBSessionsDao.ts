import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { SessionsDao } from "./SessionsDao";

export class DynamoDBSessionsDao implements SessionsDao {
  private readonly tableName = "sessions";
  private readonly authTokenAttr = "auth_token";
  private readonly timeStampAttr = "timestamp";
  private readonly handleAttr = "handle";

  private readonly client;

  public constructor (client: DynamoDBDocumentClient) {
    this.client = client
  }

  public async createSession(handle: string): Promise<AuthTokenDto | null> {
    const auth_token = AuthToken.Generate().dto;

    const params = {
      TableName: this.tableName,
      Item: {
        [this.authTokenAttr]: auth_token.token,
        [this.timeStampAttr]: auth_token.timestamp,
        [this.handleAttr]: handle,
      },
    };

    await this.client.send(new PutCommand(params));

    return auth_token;
  }

  public async getSession(token: string): Promise<AuthTokenDto | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.authTokenAttr]: token,
      },
    };

    const output = await this.client.send(new GetCommand(params));

    if (
      output.Item == undefined ||
      output.Item[this.authTokenAttr] == undefined ||
      output.Item[this.timeStampAttr] == undefined
    ) {
      return null;
    } else {
      const auth_token = new AuthToken(
        output.Item[this.authTokenAttr],
        output.Item[this.timeStampAttr]
      ).dto;
      return auth_token;
    }
  }

  public async getHandleBySession(token: string): Promise<string> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.authTokenAttr]: token,
      },
    };

    const output = await this.client.send(new GetCommand(params));

    if (output.Item == undefined || output.Item[this.handleAttr] == undefined) {
      return "";
    } else {
      return output.Item[this.handleAttr];
    }
  }

  public async deleteSession(token: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.authTokenAttr]: token,
      },
    };

    await this.client.send(new DeleteCommand(params));
  }

  public async updateSession(
    token: string,
    currentTime: number
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.authTokenAttr]: token,
      },
      ExpressionAttributeNames: {
        "#ts": this.timeStampAttr,
      },
      ExpressionAttributeValues: {
        ":newTime": currentTime,
      },
      UpdateExpression: "SET #ts = :newTime",
    };

    await this.client.send(new UpdateCommand(params));
  }

  public async checkTimeStampAndUpdate(
    auth_token: AuthTokenDto
  ): Promise<void> {
    const expirationTime = 60 * 60 * 1000;
    const currentTime = Date.now();

    if (currentTime - auth_token.timestamp > expirationTime) {
      await this.deleteSession(auth_token.token);
      throw new Error("[Bad request] session has expired, please relogin");
    }

    await this.updateSession(auth_token.token, currentTime);
  }

  public async cleanExpiredSessions(): Promise<void> {
    const params = {
      TableName: this.tableName,
    };

    const data = await this.client.send(new ScanCommand(params));

    if (!data.Items) return;

    for (const item of data.Items) {
      try {
        const authToken = new AuthToken(
          item[this.authTokenAttr],
          item[this.timeStampAttr]
        ).dto;
        await this.checkTimeStampAndUpdate(authToken);
      } catch (error) {
        console.log(`Session expired and removed: ${item[this.authTokenAttr]}`);
      }
    }
  }
}
