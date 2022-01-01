import { HttpStatus } from '@nestjs/common';

export class ResponseMessage {
  constructor(status: HttpStatus, message: string) {
    this.status = status;
    this.message = message;
  }
  status: number;
  message: string;
}
