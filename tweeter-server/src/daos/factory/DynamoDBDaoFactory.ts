import { DaoFactory } from "./DaoFactory";
import { DynamoDBSessionsDao } from "../DynamoDBSessionsDao";
import { DynamoDBUsersDao } from "../DynamoDBUsersDao";
import { S3Dao } from "../S3Dao";
import { S3DaoInterface } from "../S3DaoInterface";
import { SessionsDao } from "../SessionsDao";
import { UsersDao } from "../UsersDao";
import { FollowsDao } from "../FollowsDao";
import { DynamoDBFollowsDao } from "../DynamoDBFollowsDao";
import { StatusDao } from "../StatusDao";
import { DyanmoDBStatusDao } from "../DynamoDBStatusDao";
import { FeedDao } from "../FeedDao";
import { DynamoDBFeedDao } from "../DyanmoDBFeedDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export class DynamoDBDaoFactory implements DaoFactory {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    createUsersDao(): UsersDao {
        return new DynamoDBUsersDao(this.client);
    }

    createSessionsDao(): SessionsDao {
        return new DynamoDBSessionsDao(this.client);
    }

    createS3Dao(): S3DaoInterface {
        return new S3Dao();
    }

    createFollowsDao(): FollowsDao {
        return new DynamoDBFollowsDao(this.client);
    }

    createStatusDao(): StatusDao {
        return new DyanmoDBStatusDao(this.client);
    }

    createFeedDao(): FeedDao {
        return new DynamoDBFeedDao(this.client);
    }
}