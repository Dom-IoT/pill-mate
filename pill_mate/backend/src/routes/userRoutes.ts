import { Router } from 'express';
import * as userController from '../controllers/userController';
import { requireUser } from '../middlewares/requireUser';

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
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserInformations'
 *       400:
 *         description: Bad request.
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
 *               $ref: '#/components/schemas/UserInformations'
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.get('/me', requireUser, userController.me);


/**
 * @openapi
 * /user/{id}/reminders:
 *   get:
 *     summary: Get an helped user's reminders.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Unique identifier of the helped user.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Helped user's reminders retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: The list of the helped user's reminders.
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       403:
 *         description: The user don't have the permission to access to other users' reminders.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       404:
 *         description: Helped user not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.get('/:id/reminders', requireUser, userController.getHelpedUserReminders);

export default router;
