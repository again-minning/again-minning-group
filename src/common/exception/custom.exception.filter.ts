import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const err = exception.getResponse();
    const status = exception.getStatus();
    response.status(status).json({
      message: err.message,
      status: status,
    });
  }
}
