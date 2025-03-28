import { DaoFactory } from "./DaoFactory";
import { DynamoDBSessionsDao } from "./DynamoDBSessionsDao";
import { DynamoDBUsersDao } from "./DynamoDBUsersDao";
import { SessionsDao } from "./SessionsDao";
import { UsersDao } from "./UsersDao";

export class DynamoDBDaoFactory implements DaoFactory {
    createUsersDao(): UsersDao {
        return new DynamoDBUsersDao();
    }

    createSessionsDao(): SessionsDao {
        return new DynamoDBSessionsDao();
    }
}