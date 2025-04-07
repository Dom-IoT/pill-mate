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

const logger = createLogger('websocket');

class HomeAssistant {

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

            const message = JSON.parse(data.toString('utf-8')) as ServerMessage;
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

if (process.env.SUPERVISOR_TOKEN === undefined) {
    logger.error('SUPERVISOR_TOKEN is not set');
    process.exit(1);
}
const homeassistant = new HomeAssistant(process.env.SUPERVISOR_TOKEN);
export default homeassistant;
