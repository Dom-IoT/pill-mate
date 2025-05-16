import assert from 'assert';

import { Request, Response } from 'express';
import { Reminder } from '../models/Reminder';
import { User } from '../models/User';
import { UserRole, isUserRole } from '../models/UserRole';
import {
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
} from '../status';
import { asyncErrorHandler, checkUnexpectedKeys } from '../utils';
import { HomeAssistantService } from '../services/HomeAssistantService';

export const me = asyncErrorHandler(async (request: Request, response: Response) => {
    assert(request.user !== undefined);
    response.json({
        id: request.user.id,
        homeAssistantUserId: request.homeAssistantUserId,
        userName: request.homeAssistantUserName,
        userDisplayName: request.homeAssistantUserDisplayName,
        role: request.user.role,
        mobileAppDevice: request.user.mobileAppDevice,
    });
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         mobileAppDevice:
 *           type: string
 *           nullable: true
 *           description: The devices where notifications will be send.
 *           example: Redmi Note 8T
 */
type CreateUserBody = {
    role: unknown,
    mobileAppDevice: unknown,
};

export const createUser = asyncErrorHandler(async (request: Request, response: Response) => {
    if (!checkUnexpectedKeys<CreateUserBody>(
        request.body,
        ['role', 'mobileAppDevice'],
        response,
    )) return;

    const { role, mobileAppDevice } = request.body as CreateUserBody;

    if (role === undefined) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'role is required.' });
        return;
    }

    if (!isUserRole(role)) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Invalid role.' });
        return;
    }

    if ((mobileAppDevice !== undefined &&
         mobileAppDevice !== null &&
         typeof mobileAppDevice !== 'string') ||
        (typeof mobileAppDevice === 'string' &&
         (await HomeAssistantService.getMobileAppDevices()).find(
             device => device.name === mobileAppDevice,
         ) === undefined)) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Invalid mobileAppDevice.' });
        return;
    }

    const user = await User.findOne({
        where: {
            homeAssistantUserId: request.homeAssistantUserId,
        },
        attributes: ['id'],
    });
    if (user !== null) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'The user already exists.' });
        return;
    }

    const newUser = await User.create({
        homeAssistantUserId: request.homeAssistantUserId,
        role,
        mobileAppDevice,
    });

    response
        .status(HTTP_201_CREATED)
        .json({
            id: newUser.id,
            homeAssistantUserId: newUser.homeAssistantUserId,
            userName: request.homeAssistantUserName,
            userDisplayName: request.homeAssistantUserDisplayName,
            role: newUser.role,
            mobileAppDevice: newUser.mobileAppDevice,
        });
});

export const getHelpedUserReminders = asyncErrorHandler(async (
    request: Request,
    response: Response,
) => {
    assert(request.user !== undefined);
    assert(request.params.id !== undefined);

    if (!/^\d+$/.test(request.params.id)) {
        response
            .status(HTTP_400_BAD_REQUEST)
            .json({ message: 'Invalid parameter: id.' });
        return;
    }

    const id = parseInt(request.params.id, 10);

    if (id === request.user.id) {
        const reminders = await request.user.getReminders();

        response
            .status(HTTP_200_OK)
            .json(reminders);
        return;
    }

    if (request.user.role === UserRole.HELPED) {
        response
            .status(HTTP_403_FORBIDDEN)
            .json({ message: 'You do not have permission to access this resource.' });
        return;
    }

    const helpedUsers = await request.user.getHelpedUsers({
        where: { id },
        attributes: ['id'],
    });
    assert(helpedUsers.length <= 1);
    if (helpedUsers.length === 0) {
        response
            .status(HTTP_404_NOT_FOUND)
            .json({ message: 'User not found.' });
        return;
    }

    const reminders = await Reminder.findAll({
        where: {
            userId: helpedUsers[0].id,
        },
    });

    response
        .status(HTTP_200_OK)
        .json(reminders);
});
