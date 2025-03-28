import { AuthTokenDto } from "tweeter-shared";

export interface SessionsDao {
    createSession(): Promise<AuthTokenDto | null>;
    getSession(token: string): Promise<AuthTokenDto | null>;
    deleteSession(token: string): Promise<void>;
}