type VersionMessage = { ha_version: string };
type IdMessage = { id: number };

export type AuthRequiredMessage = VersionMessage & { type: 'auth_required' };
export type AuthOkMessage = VersionMessage & { type: 'auth_ok' };
export type AuthInvalid = { type: 'auth_invalid', message: string };

export type BaseResultMessage = IdMessage & {
    type: 'result',
    success: boolean,
};
export type ResultSuccessMessage = BaseResultMessage & {
    success: true,
    result: object,
};
export type ResultErrorMessage = BaseResultMessage & {
    success: false,
    error: {
        code: string,
        message: string,
    },
};

export type Message = (
    | AuthRequiredMessage
    | AuthOkMessage
    | AuthInvalid
    | ResultSuccessMessage
    | ResultErrorMessage
);
