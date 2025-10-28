import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception.cause) {
      console.error(exception.cause);
    }

    const res: ApiResponse = {
      success: false,
      statusCode: status,
      message: exception.message,
      content: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(res);
  }
}
