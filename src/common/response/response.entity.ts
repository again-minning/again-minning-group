import { HttpStatus } from '@nestjs/common';
import { ResponseMessage } from './response.message';

export class ResponseEntity<T> {
  private readonly message: ResponseMessage;
  private readonly data: T;

  private constructor(message: ResponseMessage, data: T) {
    this.message = message;
    this.data = data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      new ResponseMessage(HttpStatus.OK, ''),
      '',
    );
  }

  static OK_WITH<T>(message: ResponseMessage, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(message, data);
  }
}
