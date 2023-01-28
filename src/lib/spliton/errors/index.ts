import BaseError from './base-error';

export class InvalidInputError extends BaseError {
  constructor(input: string) {
    super(`Invalid input source '${input}'`, 'ERR_0');
  }
}
