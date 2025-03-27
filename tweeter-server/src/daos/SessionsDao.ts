import { AuthTokenDto } from "tweeter-shared";

export interface SessionsDao {
    createSession(): Promise<AuthTokenDto | null>;
}