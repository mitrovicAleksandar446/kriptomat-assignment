import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(UniqueConstraintViolationException)
export class UniqueViolationExceptionFilter implements ExceptionFilter {
  constructor(private readonly message: string) {}

  catch(exception: UniqueConstraintViolationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: this.message,
    });
  }
}
