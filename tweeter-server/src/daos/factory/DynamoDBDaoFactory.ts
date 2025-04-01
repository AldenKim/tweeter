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

export class DynamoDBDaoFactory implements DaoFactory {
    createUsersDao(): UsersDao {
        return new DynamoDBUsersDao();
    }

    createSessionsDao(): SessionsDao {
        return new DynamoDBSessionsDao();
    }

    createS3Dao(): S3DaoInterface {
        return new S3Dao();
    }

    createFollowsDao(): FollowsDao {
        return new DynamoDBFollowsDao();
    }

    createStatusDao(): StatusDao {
        return new DyanmoDBStatusDao();
    }

    createFeedDao(): FeedDao {
        return new DynamoDBFeedDao();
    }
}