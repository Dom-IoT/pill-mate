import { Router } from 'express';
import * as userController from '../controllers/userController';

const router = Router();

/**
 * @openapi
 * /user/:
 *   post:
 *     summary: Create a new user.
 *     description: Create a new user and link it to a Home Assistant user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 $ref: '#/components/schemas/UserRole'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description : Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.post('/', userController.createUser);

/**
 * @openapi
 * /user/me:
 *   get:
 *     summary: Get information about the current user.
 *     description: Get all the information of the authenticated user.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 homeAssistantUserId:
 *                   type: string
 *                   description: Unique identifier of the user in Home Assistant.
 *                   example: c355d2aaeee44e4e84ff8394fa4794a9
 *                 userName:
 *                   type: string
 *                   description: TThe username of the user in the system.
 *                   example: johndoe
 *                 userDisplayName:
 *                   type: string
 *                   description: The display name of the user.
 *                   example: John Doe
 *                 role:
 *                   $ref: '#/components/schemas/UserRole'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.get('/me', userController.me);

export default router;
