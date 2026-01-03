import { StatusCodes } from 'http-status-codes';
import APIError from './api.error.js';

class UnauthenticatedError extends APIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
