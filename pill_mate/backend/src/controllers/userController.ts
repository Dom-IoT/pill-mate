import { Request, Response } from 'express';
import { User, isUserRole } from '../models/User';
import { HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND } from '../status';

export const me = async (request: Request, response: Response) => {
    const user = await User.findOne({
        where: {
            homeAssistantUserId: request.homeAssistantUserId,
        },
    });
    if (user === null) {
        response
            .status(HTTP_404_NOT_FOUND)
            .json({ message: 'Not Found.' });
        return;
    }

    response.json({
        homeAssistantUserId: request.homeAssistantUserId,
        userName: request.homeAssistantUserName,
        userDisplayName: request.homeAssistantUserDisplayName,
        role: user.role,
    });
};

export const createUser = async (request: Request, response: Response) => {
    const { role } = request.body as { role?: unknown };
    if (role === undefined) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Role is required.' });
        return;
    }

    if (!isUserRole(role)) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Invalid role.' });
        return;
    }

    const user = await User.findOne({
        where: {
            homeAssistantUserId: request.homeAssistantUserId,
        },
    });
    if (user !== null) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'The user already exists.' });
        return;
    }

    await User.create({
        homeAssistantUserId: request.homeAssistantUserId,
        role,
    });

    response
        .status(HTTP_201_CREATED)
        .json({ message: 'User created successfully.' });
};
