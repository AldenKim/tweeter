import { FeedDao } from "../FeedDao";
import { FollowsDao } from "../FollowsDao";
import { S3DaoInterface } from "../S3DaoInterface";
import { SessionsDao } from "../SessionsDao";
import { StatusDao } from "../StatusDao";
import { UsersDao } from "../UsersDao";

export interface DaoFactory {
    createUsersDao(): UsersDao; 
    createSessionsDao(): SessionsDao;
    createS3Dao(): S3DaoInterface;
    createFollowsDao(): FollowsDao;
    createStatusDao(): StatusDao;
    createFeedDao(): FeedDao;
}