import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
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
}
