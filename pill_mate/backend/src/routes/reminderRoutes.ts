import { Router } from 'express';
import * as reminderController from '../controllers/reminderController';
import { requireUser } from '../middlewares/requireUser';

const router = Router();

/**
 * @openapi
 * /reminder/:
 *   get:
 *     summary: Get the reminders of the currently logged user.
 *     tags: [Reminders]
 *     responses:
 *       200:
 *         description: Reminders retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: The list of the user's reminders.
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.get('/', requireUser, reminderController.getReminders);


/**
 * @openapi
 * /reminder/:
 *   post:
 *     summary: Create a new reminder.
 *     tags: [Reminders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReminder'
 *     responses:
 *       201:
 *         description: Reminder created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request.
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
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       404:
 *         description: Helped user or medication not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.post('/', requireUser, reminderController.createReminder);

/**
 * @openapi
 * /reminder/{id}:
 *   patch:
 *     summary: Modify a reminder.
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Unique identifier of the reminder.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatchReminder'
 *     responses:
 *       200:
 *         description: Reminder modified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       404:
 *         description: Reminder or medication not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.patch('/:id', requireUser, reminderController.patchReminder);

/**
 * @openapi
 * /reminder/{id}:
 *   delete:
 *     summary: Delete a reminder.
 *     tags: [Reminders]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Unique identifier of the reminder.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Reminder deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       401:
 *         description: The user is not registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 *       404:
 *         description: Reminder not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessageResponse'
 */
router.delete('/:id', requireUser, reminderController.deleteReminder);

export default router;
