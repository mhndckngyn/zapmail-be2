import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ApiResponse } from 'src/lib/response';

@Controller('threads')
export class ThreadsController {
  constructor(private threadsService: ThreadsService) {}

  @Get()
  async getThreads(
    @Query('userId') userId: string,
    @Query('tab') tab: string,
    @Query('done') doneStr: string,
  ) {
    // Validate query params
    if (!userId || !tab || doneStr === undefined) {
      const response: ApiResponse = {
        success: false,
        message: 'threads:missing-query-params',
        content: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };
      return response;
    }

    if (!['inbox', 'sent', 'drafts'].includes(tab)) {
      const response: ApiResponse = {
        success: false,
        message: 'threads:invalid-tab',
        content: null,
        statusCode: HttpStatus.BAD_REQUEST,
      };
      return response;
    }

    const done = doneStr === 'true';

    try {
      const threads = await this.threadsService.getThreads({
        userId,
        tab,
        done,
      });

      const response: ApiResponse = {
        success: true,
        message: 'threads:get.success',
        content: threads,
        statusCode: HttpStatus.OK,
      };

      return response;
    } catch (err: unknown) {
      let message = 'Unknown error';
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      if (err instanceof Error) {
        message = err.message;
      }

      if (err instanceof HttpException) {
        status = err.getStatus();
      }

      const response: ApiResponse = {
        success: false,
        message: 'threads:get.failed',
        content: message,
        statusCode: status,
      };

      return response;
    }
  }
}
