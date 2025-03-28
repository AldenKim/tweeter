import { SessionsDao } from "./SessionsDao";
import { UsersDao } from "./UsersDao";

export interface DaoFactory {
    createUsersDao(): UsersDao; 
    createSessionsDao(): SessionsDao;
}