/**
 * This file tries documents the messages received from the Home Assistant server through its
 * WebSocket API.
 * WARN: These types are incomplete! Fields types may be wrong or fields may be missing.
 */

type VersionMessage = { ha_version: string };
type IdMessage = { id: number };

export type AuthRequiredMessage = VersionMessage & { type: 'auth_required' };
export type AuthOkMessage = VersionMessage & { type: 'auth_ok' };
export type AuthInvalid = { type: 'auth_invalid', message: string };

export type PongMessage = IdMessage & { type: 'pong' };

export type EntitySourceResult = {
    [key: string]: { domain: string },
};
export type GetStatesResult = Array<{
    entity_id: string,
    state: string,
}>;
export type GetServicesResult = {
    [key: string]: {
        [key: string]: {
            name?: string,
            description: string,
            field: {
                [key: string]: {
                    name: string,
                    description: string,
                    required?: boolean,
                    selector: unknown
                },
            },
            target?: {
                device?: Array<unknown>,
                entity?: Array<{
                    domain?: string[],
                    integration?: string,
                    supported_features?: number[],
                }>,
            },
        },
    },
};
export type PersonListResult = {
    storage: Array<{
        id: string,
        name: string,
        user_id: string,
        device_trackers: string[],
        picture?: null
    } >,
    config: unknown[],
};
type Result = (
    | EntitySourceResult
    | GetStatesResult
    | GetServicesResult
    | PersonListResult
);

export type BaseResultMessage = IdMessage & {
    type: 'result',
    success: boolean,
};
export type ResultSuccessMessage = BaseResultMessage & {
    success: true,
    result: Result,
};
export type ResultErrorMessage = BaseResultMessage & {
    success: false,
    error: {
        code: string,
        message: string,
    },
};

export type ServerMessage = (
    | AuthRequiredMessage
    | AuthOkMessage
    | AuthInvalid
    | PongMessage
    | ResultSuccessMessage
    | ResultErrorMessage
);
