import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

import { WebSocket } from 'ws';

import { createLogger } from '../../logger';
import {
    Device,
    EntitySourceResult,
    GetDevicesResult,
    GetServicesResult,
    GetStatesResult,
    PersonListResult,
    ResultSuccessMessage,
    ServerMessage,
} from './ServerMessage';
import { ClientMessage, CommandMessageWithoutId } from './ClientMessage';

const WEBSOCKET_URL: string = 'ws://supervisor/core/websocket';
const MAX_RETRY: number = 10;
const RETRY_DELAY: number = 5_000;  // 5 s

const logger = createLogger('websocket');
const beckendLogger = createLogger('backend');

export type Notification = {
    title?: string,
    message: string,
    data?: {
        url: string,
        clickAction: string,
    },
} | {
    message: 'command_webview',
    data: {
        command: string,
    },
};

export class HomeAssistantService {

    private static webSocket: WebSocket;
    private static addonSlug: string;
    private static connected: boolean = false;
    private static nextId: number = 1;
    private static pendingRequests: { [key: number]: {
        resolve(result: object): void,
        reject(error: Error): void,
    } } = {};

    static async init(accessToken: string) {
        await HomeAssistantService.tryConnect(accessToken, 0);
    }

    private static async tryConnect(
        accessToken: string,
        tryCount: number,
    ) {
        logger.info('Trying to connect to Home Assistant WebSocket server');
        try {
            await HomeAssistantService.connect(accessToken);
        } catch {
            logger.error('Failed to connect to Home Assistant WebSocket server');
            if (tryCount < MAX_RETRY) {
                logger.info(`Retrying in ${(RETRY_DELAY / 1000).toFixed(1)} seconds`);
                await setTimeoutPromise(RETRY_DELAY);
                await HomeAssistantService.tryConnect(accessToken, tryCount + 1);
                return;
            }

            logger.error('Maximum number of tries reached');
            logger.error('Exiting');
            process.exit(1);
        }
    }

    private static connect(accessToken: string): Promise<void> {
        return new Promise((resolve, reject) => {
            HomeAssistantService.webSocket = new WebSocket(WEBSOCKET_URL);

            HomeAssistantService.webSocket.on('open', () => {
                logger.info('Connected to Home Assistant WebSocket server');
                HomeAssistantService.connected = true;
            });

            HomeAssistantService.webSocket.on('error', logger.error.bind(logger));

            HomeAssistantService.webSocket.on('close', (code, reason) => {
                logger.error(`Connection closed: ${code} ${reason}`);
                if (!HomeAssistantService.connected)  {
                    reject();
                } else {
                    logger.error('Exiting');
                    process.exit(1);
                }
            });

            HomeAssistantService.webSocket.on('message', async (data, isBinary) => {
                if (isBinary) {
                    logger.error('Binary message received');
                    return;
                };

                const message = JSON.parse(data.toString('utf-8')) as ServerMessage;
                logger.debug(`Received message: ${data}`);

                if (message.type === 'auth_required') {
                    HomeAssistantService.send({
                        type: 'auth',
                        access_token: accessToken,
                    });
                    return;
                }

                if (message.type === 'auth_ok') {
                    logger.info('Authentication succeeded');
                    HomeAssistantService.addonSlug = await HomeAssistantService.getAddonSlug(
                        accessToken,
                    );
                    resolve();
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

                        HomeAssistantService.pendingRequests[message.id]?.reject(
                            new Error(message.error.message),
                        );
                        return;
                    }

                    HomeAssistantService.pendingRequests[message.id]?.resolve(message);
                    return;
                }

                logger.error(`Unknown message type: ${(message as { type: string }).type}`);
            });
        });
    }

    private static async getAddonSlug(accessToken: string) {
        const response = await fetch('http://supervisor/addons/self/info', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            beckendLogger.error('Failed to get Add-on slug');
            process.exit(1);
        }
        const { data } = (await response.json()) as { data: { slug: string } };
        return data.slug;
    }

    private static send(data: ClientMessage) {
        const message = JSON.stringify(data);
        logger.debug(`Send message: ${message}`);
        HomeAssistantService.webSocket.send(message);
    }

    private static sendWithId(data: CommandMessageWithoutId): Promise<ResultSuccessMessage> {
        return new Promise((resolve, reject) => {
            HomeAssistantService.pendingRequests[HomeAssistantService.nextId] = { resolve, reject };
            HomeAssistantService.send({ id: HomeAssistantService.nextId, ...data });
            ++HomeAssistantService.nextId;
        });
    }

    static async entitySource(): Promise<EntitySourceResult> {
        return (await HomeAssistantService.sendWithId({
            type: 'entity/source',
        })).result as EntitySourceResult;
    }

    static async getStates(): Promise<GetStatesResult> {
        return (await HomeAssistantService.sendWithId({
            type: 'get_states',
        })).result as GetStatesResult;
    }

    static async getServices(): Promise<GetServicesResult> {
        return (await HomeAssistantService.sendWithId({
            type: 'get_services',
        })).result as GetServicesResult;
    }

    static async getEntitiesByDomain(domain: string): Promise<string[]> {
        const entities = await HomeAssistantService.entitySource();
        return Object.keys(entities).filter(entity => entities[entity].domain === domain);
    }

    static getSpeakers(): Promise<string[]> {
        return HomeAssistantService.getEntitiesByDomain('media_player');
    }

    static async callServices(domain: string, service: string, serviceData?: object) {
        await HomeAssistantService.sendWithId({
            type: 'call_service',
            domain,
            service,
            service_data: serviceData,
        });
    }

    static getTTSEntity(): Promise<string[]> {
        return HomeAssistantService.getEntitiesByDomain('tts');
    }

    static async ttsSpeak(message: string, speaker: string, ttsEntity: string, language: string) {
        await HomeAssistantService.callServices('tts', 'speak', {
            media_player_entity_id: speaker,
            entity_id: ttsEntity,
            message,
            language,
        });
    }

    static async playMedia(url: string, speaker: string) {
        await HomeAssistantService.callServices('media_player', 'play_media', {
            media_content_id: url,
            media_content_type: 'audio/mp3',
            entity_id: speaker,
        });
    }

    static async getUsers() {
        const result = (await HomeAssistantService.sendWithId({
            type: 'person/list',
        })).result as PersonListResult;
        return result.storage;
    }

    static async getDevices(): Promise<Device[]> {
        const result = (await HomeAssistantService.sendWithId({
            type: 'config/device_registry/list',
        })).result as GetDevicesResult;
        return result;
    }

    static async getMobileAppDevices(): Promise<Device[]> {
        const devices = await HomeAssistantService.getDevices();
        return devices.filter(device => device.identifiers.some(
            array => array.some(
                str => str === 'mobile_app',
            ),
        ));
    }

    private static getAddonUrl(): string {
        return `/${HomeAssistantService.addonSlug}/ingress`;
    }

    static async sendNotification(device: string, notification: Notification) {
        const deviceId = device.toLowerCase().replaceAll(' ', '_');
        if (notification.data === undefined) {
            const url = HomeAssistantService.getAddonUrl();
            notification.data = {
                url,
                clickAction: url,
            };
        }
        await HomeAssistantService.callServices(
            'notify',
            `mobile_app_${deviceId}`,
            notification,
        );
    }

    static async openMobileAppOnDevice(device: string) {
        await HomeAssistantService.sendNotification(device, {
            message: 'command_webview',
            data: {
                command: HomeAssistantService.getAddonUrl(),
            },
        });
    }
}
