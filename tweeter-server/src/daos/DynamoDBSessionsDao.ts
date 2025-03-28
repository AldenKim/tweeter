import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken, AuthTokenDto } from "tweeter-shared";
import { SessionsDao } from "./SessionsDao";

export class DynamoDBSessionsDao implements SessionsDao {
  private readonly tableName = "sessions";
  private readonly authTokenAttr = "auth_token";
  private readonly timeStampAttr = "timestamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async createSession(): Promise<AuthTokenDto | null> {
    const auth_token = AuthToken.Generate().dto;

    const params = {
      TableName: this.tableName,
      Item: {
        [this.authTokenAttr]: auth_token.token,
        [this.timeStampAttr]: auth_token.timestamp,
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
      ExpressionAttributeValues: { ":inc": 1 },
      UpdateExpression:
        "SET " + this.timeStampAttr + " = " + currentTime + " + :inc",
    };

    await this.client.send(new UpdateCommand(params));
  }

  public async checkTimeStampAndUpdate(
    auth_token: AuthTokenDto
  ): Promise<boolean> {
    const expirationTime = 60 * 60 * 1000;
    const currentTime = Date.now();

    if (currentTime - auth_token.timestamp > expirationTime) {
      await this.deleteSession(auth_token.token);
      return false;
    }

    return true;
  }
}
