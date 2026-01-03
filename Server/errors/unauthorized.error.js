import { StatusCodes } from 'http-status-codes';
import APIError from './api.error.js';

class UnauthorizedError extends APIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default UnauthorizedError;
