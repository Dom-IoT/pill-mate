import { Router } from 'express';

import * as homeAssistantController from '../controllers/homeAssistantController';
import { requireUser } from '../middlewares/requireUser';

const router = Router();

/**
 * @openapi
 * /homeassistant/mobile-app-devices:
 *   get:
 *     summary: Get the list of devices with the mobile application.
 *     description: Get the list of devices with the Home Assistant mobile application.
 *     tags: [Home Assistant]
 *     responses:
 *       200:
 *         description: Devices list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: The name of a device.
 *                 example: Redmi Note 8T
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.get('/mobile-app-devices', requireUser, homeAssistantController.getMobileAppDevices);

export default router;
