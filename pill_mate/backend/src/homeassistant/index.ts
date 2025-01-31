import { WebSocket } from 'ws';

import { createLogger } from '../logger';
import { Message, ResultSuccessMessage } from './message';

const logger = createLogger('websocket');

export default class HomeAssistant {

    private readonly webSocket: WebSocket;
    private readonly accessToken: string;
    private nextId: number = 1;
    private pendingRequests: { [key: number]: {
        resolve(result: object): void,
        reject(error: Error): void,
    } } = {};

    constructor(accessToken: string) {
        this.accessToken = accessToken;

        this.webSocket = new WebSocket('ws://supervisor/core/websocket');

        this.webSocket.on('open', () => {
            logger.info('Connected to Home Assistant WebSocket server');
        });

        this.webSocket.on('error', logger.error);

        this.webSocket.on('close', (code, reason) => {
            logger.error(`Connection closed: ${code} ${reason}`);
        });

        this.webSocket.on('message', (data, isBinary) => {
            if (isBinary) {
                logger.error('Binary message received');
                return;
            };

            const message = JSON.parse(data.toString('utf-8')) as Message;
            logger.debug(`Received message: ${data}`);

            if (message.type === 'auth_required') {
                this.send({
                    type: 'auth',
                    access_token: this.accessToken,
                });
                return;
            }

            if (message.type === 'auth_ok') {
                logger.info('Authentication succeeded');
                return;
            }

            if (message.type === 'auth_invalid') {
                logger.error(`Authentication failed: ${message.message}`);
                process.exit(1);
            }

            if (message.type === 'result') {
                if (!message.success) {
                    logger.error(`${message.error.code}: ${message.error.message}`);

                    this.pendingRequests[message.id]?.reject(new Error(message.error.message));
                    return;
                }

                this.pendingRequests[message.id]?.resolve(message);
                return;
            }

            logger.error(`Unknown message type: ${(message as { type: string }).type}`);
        });
    }

    private send(data: object) {
        const message = JSON.stringify(data);
        logger.debug(`Send message: ${message}`);
        this.webSocket.send(message);
    }

    private send_with_id(data: object): Promise<ResultSuccessMessage> {
        this.send({ id: this.nextId, ...data });
        return new Promise((resolve, reject) => {
            this.pendingRequests[this.nextId] = { resolve, reject };
            ++this.nextId;
        });
    }
}
