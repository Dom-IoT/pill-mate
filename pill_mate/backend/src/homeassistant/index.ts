import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

import { WebSocket } from 'ws';

import { createLogger } from '../logger';
import {
    EntitySourceResult,
    GetServicesResult,
    GetStatesResult,
    PersonListResult,
    ResultSuccessMessage,
    ServerMessage,
} from './server_message';
import { ClientMessage, CommandMessageWithoutId } from './client_message';

const WEBSOCKET_URL: string = 'ws://supervisor/core/websocket';
const MAX_RETRY: number = 10;
const RETRY_DELAY: number = 5_000;  // 5 s

const logger = createLogger('websocket');

export class HomeAssistant {

    private readonly webSocket: WebSocket;
    private connected: boolean = false;
    private nextId: number = 1;
    private pendingRequests: { [key: number]: {
        resolve(result: object): void,
        reject(error: Error): void,
    } } = {};

    private constructor(
        accessToken: string,
        resolve: (value: HomeAssistant) => void,
        reject: () => void,
    ) {
        this.webSocket = new WebSocket(WEBSOCKET_URL);

        this.webSocket.on('open', () => {
            logger.info('Connected to Home Assistant WebSocket server');
            this.connected = true;
        });

        this.webSocket.on('error', logger.error.bind(logger));

        this.webSocket.on('close', (code, reason) => {
            logger.error(`Connection closed: ${code} ${reason}`);
            if (!this.connected)  {
                reject();
            } else {
                logger.error('Exiting');
                process.exit(1);
            }
        });

        this.webSocket.on('message', (data, isBinary) => {
            if (isBinary) {
                logger.error('Binary message received');
                return;
            };

            const message = JSON.parse(data.toString('utf-8')) as ServerMessage;
            logger.debug(`Received message: ${data}`);

            if (message.type === 'auth_required') {
                this.send({
                    type: 'auth',
                    access_token: accessToken,
                });
                return;
            }

            if (message.type === 'auth_ok') {
                logger.info('Authentication succeeded');
                resolve(this);
                return;
            }

            if (message.type === 'auth_invalid') {
                logger.error(`Authentication failed: ${message.message}`);
                logger.error('Exiting');
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

    private static async tryConnect(accessToken: string, tryCount: number): Promise<HomeAssistant> {
        logger.info('Trying to Home Assistant WebSocket server');
        try {
            return await new Promise((resolve, reject) => {
                new HomeAssistant(accessToken, resolve, reject);
            });
        } catch {
            logger.error('Failed to connect to Home Assistant WebSocket server');
            if (tryCount < MAX_RETRY) {
                logger.info(`Retrying in ${(RETRY_DELAY / 1000).toFixed(1)} seconds`);
                await setTimeoutPromise(RETRY_DELAY);
                return await HomeAssistant.tryConnect(accessToken, tryCount + 1);
            }

            logger.error('Maximum number of tries reached');
            logger.error('Exiting');
            process.exit(1);
        }
    }

    static create(accessToken: string): Promise<HomeAssistant> {
        return HomeAssistant.tryConnect(accessToken, 0);
    }

    private send(data: ClientMessage) {
        const message = JSON.stringify(data);
        logger.debug(`Send message: ${message}`);
        this.webSocket.send(message);
    }

    sendWithId(data: CommandMessageWithoutId): Promise<ResultSuccessMessage> {
        return new Promise((resolve, reject) => {
            this.pendingRequests[this.nextId] = { resolve, reject };
            this.send({ id: this.nextId, ...data });
            ++this.nextId;
        });
    }

    async entitySource(): Promise<EntitySourceResult> {
        return (await this.sendWithId({ type: 'entity/source' })).result as EntitySourceResult;
    }

    async getStates(): Promise<GetStatesResult> {
        return (await this.sendWithId({ type: 'get_states' })).result as GetStatesResult;
    }

    async getServices(): Promise<GetServicesResult> {
        return (await this.sendWithId({ type: 'get_services' })).result as GetServicesResult;
    }

    async getEntitiesByDomain(domain: string): Promise<string[]> {
        const entities = await this.entitySource();
        return Object.keys(entities).filter(entity => entities[entity].domain === domain);
    }

    getSpeakers(): Promise<string[]> {
        return this.getEntitiesByDomain('media_player');
    }

    async callServices(domain: string, service: string, serviceData?: object) {
        await this.sendWithId({
            type: 'call_service',
            domain,
            service,
            service_data: serviceData,
        });
    }

    getTTSEntity(): Promise<string[]> {
        return this.getEntitiesByDomain('tts');
    }

    async ttsSpeak(message: string, speaker: string, ttsEntity: string, language: string) {
        this.callServices('tts', 'speak', {
            media_player_entity_id: speaker,
            entity_id: ttsEntity,
            message,
            language,
        });
    }

    async getUsers() {
        const result = (await this.sendWithId({ type: 'person/list' })).result as PersonListResult;
        return result.storage;
    }
}
