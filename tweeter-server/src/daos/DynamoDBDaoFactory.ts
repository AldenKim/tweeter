import { DaoFactory } from "./DaoFactory";
import { DynamoDBUsersDao } from "./DynamoDBUsersDao";
import { UsersDao } from "./UsersDao";

export class DynamoDBDaoFactory implements DaoFactory {
    createUsersDao(): UsersDao {
        return new DynamoDBUsersDao();
    }
}