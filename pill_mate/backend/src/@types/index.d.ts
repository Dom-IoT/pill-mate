declare namespace Express {
    export interface Request {
        homeAssistantUserId: string,
        homeAssistantUserName: string,
        homeAssistantUserDisplayName: string,
    }
}
