import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
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
    console.log(handle);
    const params = {
      TableName: this.tableName,
      Key: {
        [this.handleAttr]: handle,
      },
    };

    const output = await this.client.send(new GetCommand(params));
    console.log(output);

    if (
      output.Item == undefined ||
      output.Item[this.firstNameAttr] == undefined ||
      output.Item[this.lastNameAttr] == undefined ||
      output.Item[this.handleAttr] == undefined
    ) {
      console.log("didnt find it");
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
