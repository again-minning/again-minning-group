import { HttpStatus } from '@nestjs/common';
import { ResponseMessage } from './response.message';

export class ResponseEntity<T> {
  private readonly message: ResponseMessage;
  private readonly data: T;

  private constructor(message: ResponseMessage, data: T) {
    this.message = message;
    this.data = data;
  }

  static OK(message: string): ResponseMessage {
    return new ResponseMessage(HttpStatus.OK, message);
  }

  static OK_WITH<T>(message: ResponseMessage, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(message, data);
  }
}
