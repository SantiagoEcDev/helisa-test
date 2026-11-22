
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";

import type { Response } from "express";
import { AccountAlreadyExistsError, AccountDomainError, AccountHasChildrenError, AccountNotFoundError, AccountParentNotFoundError } from "../../domain/errors/account.error.js";


@Catch(AccountDomainError)
export class AccountExceptionFilter implements ExceptionFilter {
  catch(
    exception: AccountDomainError,
    host: ArgumentsHost,
  ): void {
    const response = host
      .switchToHttp()
      .getResponse<Response>();

    let status: number = HttpStatus.BAD_REQUEST;

    if (
      exception instanceof AccountAlreadyExistsError ||
      exception instanceof AccountHasChildrenError
    ) {
      status = HttpStatus.CONFLICT;
    } else if (
      exception instanceof AccountNotFoundError ||
      exception instanceof AccountParentNotFoundError
    ) {
      status = HttpStatus.NOT_FOUND;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: exception.code,
    });
  }
}
