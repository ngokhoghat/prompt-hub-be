export interface IRemoteConfig {
    endpoint?: string;
    accessToken?: string;
    googleApiKey: string;
    [key: string]: any;
}

export interface ResultResponse {
    code?: number;
    status: 'success' | 'false';
    data?: any;
    message: string | string[];
}

export const handleErrorRequest = (message: string, code?: number, data?: any): ResultResponse => {
    const response: ResultResponse = {
        status: 'false',
        message: message,
    };

    if (code) response.code = code;
    if (data) response.data = data;
    return response;
}

export const handleSuccessRequest = (data: any, message?: string, code?: number): ResultResponse => {
    const response: ResultResponse = {
        status: 'success',
        message: message || 'success',
        data: data,
    };

    if (code) response.code = code;
    return response;
}