import { User } from '../models/User';

declare module 'express-serve-static-core' {
    export interface Request {
        homeAssistantUserId: string,
        homeAssistantUserName: string,
        homeAssistantUserDisplayName: string,
        user?: User,
    }
}
