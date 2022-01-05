import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Connection } from 'typeorm';
import { SEVER_ERROR } from './response/content/message.common';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private connection: Connection) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    req.manager = queryRunner.manager;
    return next.handle().pipe(
      catchError(async (err) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        if (err instanceof HttpException) {
          throw new HttpException(err.getResponse(), err.getStatus());
        } else {
          throw new InternalServerErrorException(SEVER_ERROR);
        }
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}
