/**
 * This file documents the types of the messages we can send to the Home
 * Assistant server.
 * WARN: These types are incomplete! Fields types may be wrong or fields may be missing.
 */
export type AuthMessage = { type: 'auth', access_token: string };

export type AuthCurrentUserMessage = { type: 'auth/current_user' };
export type CallServiceMessage = {
    type: 'call_service',
    domain: string,
    service: string,
    service_data?: object,
    target?: {
        entity_id?: string | string[],
        device_id?: string | string[],
        area_id?: string | string[],
        floor_id?: string | string[],
        label_id?: string | string[],
    },
    return_response?: boolean,
};
export type EntitySourceMessage = { type: 'entity/source' };
export type GetConfigMessage = { type: 'get_config' };
export type GetDevicesMessage = { type: 'config/device_registry/list' };
export type GetPanelsMessage = { type: 'get_panels' };
export type GetServicesMessage = { type: 'get_services' };
export type GetStatesMessage = { type: 'get_states' };
export type PersonListMessage = { type: 'person/list' };
export type PingMessage = { type: 'ping' };

export type CommandMessageWithoutId = (
    | AuthCurrentUserMessage
    | CallServiceMessage
    | EntitySourceMessage
    | GetConfigMessage
    | GetDevicesMessage
    | GetPanelsMessage
    | GetServicesMessage
    | GetStatesMessage
    | PersonListMessage
    | PingMessage
);

export type CommandMessage = { id: number } & CommandMessageWithoutId;

export type ClientMessage = (
    | AuthMessage
    | CommandMessage
);
