import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UsersDao } from "./UsersDao";
import { User, UserDto } from "tweeter-shared";

export class DynamoDBUsersDao implements UsersDao {
  private readonly tableName = "users";
  private readonly handleAttr = "handle";
  private readonly firstNameAttr = "firstName";
  private readonly lastNameAttr = "lastName";
  private readonly imageUrlAttr = "imageUrl";
  private readonly passwordAttr = "password";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async getUser(handle: string): Promise<UserDto | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.handleAttr]: handle,
      },
    };

    const output = await this.client.send(new GetCommand(params));

    if (
      output.Item == undefined ||
      output.Item[this.firstNameAttr] == undefined ||
      output.Item[this.lastNameAttr] == undefined ||
      output.Item[this.handleAttr] == undefined
    ) {
      return null;
    } else {
      const user = new User(
        output.Item[this.firstNameAttr],
        output.Item[this.lastNameAttr],
        output.Item[this.handleAttr],
        output.Item[this.imageUrlAttr]
      ).dto;
      return user;
    }
  }

  public async addUser(newUser: User, password: string): Promise<UserDto | null> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.handleAttr]: newUser.alias,
        [this.firstNameAttr]: newUser.firstName,
        [this.lastNameAttr]: newUser.lastName,
        [this.imageUrlAttr]: newUser.imageUrl,
        [this.passwordAttr]: password
      },
    };

    await this.client.send(new PutCommand(params));

    return newUser.dto;
  }

  public async getPassword(handle: string): Promise<string | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.handleAttr]: handle,
      },
      ProjectionExpressions: this.passwordAttr,
    };

    const output = await this.client.send(new GetCommand(params));

    if (
      output.Item == undefined ||
      output.Item[this.passwordAttr] == undefined
    ) {
      return null;
    } else {
      return output.Item[this.passwordAttr];
    }
  }
}
