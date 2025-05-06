import assert from 'assert';

import { Request, Response } from 'express';

import { HTTP_200_OK } from '../status';
import { asyncErrorHandler } from '../utils';
import { HomeAssistantService } from '../services/HomeAssistantService';

export const getMobileAppDevices = asyncErrorHandler(async (
    request: Request,
    response: Response,
) => {
    assert(request.user !== undefined);

    const devies = await HomeAssistantService.getMobileAppDevices();

    response
        .status(HTTP_200_OK)
        .json(devies.map(device => device.name));
});
