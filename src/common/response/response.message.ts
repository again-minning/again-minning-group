import { HttpStatus } from '@nestjs/common';

export class ResponseMessage {
  constructor(status: HttpStatus, message: string) {
    this.status = status;
    this.message = message;
  }
  status: number;
  message: string;
}

export class CommonResponse {
  constructor(status: HttpStatus, message: string, data: unknown) {
    this.message = new ResponseMessage(status, message);
    this.data = data;
  }
  message: ResponseMessage;
  data: unknown;
}
