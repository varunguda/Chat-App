export interface IErrorHandler extends Error {
    status: number;
    message: string;
    code?: number;
    path?: string;
    keyValue?: object;
}


export class ErrorHandler extends Error implements IErrorHandler {
    status: number;
    constructor(message?: string, status?: number){
        super(message || "Internal Server Error!")
        this.status = status || 500
    }
}