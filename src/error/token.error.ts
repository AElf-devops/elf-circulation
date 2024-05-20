import { MidwayError } from '@midwayjs/core';

export class TokenEmptyDataError extends MidwayError {
  constructor(err?: Error) {
    super('Only support ELF', {
      cause: err,
    });
    if (err?.stack) {
      this.stack = err.stack;
    }
  }
}
