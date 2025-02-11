/* eslint-disable linebreak-style */
import { Error } from 'mongoose';

class NotFoundError extends Error {
  public statusCode: number;

  constructor() {
    super('Страница не найдена');
    this.statusCode = 404;
  }
}

export default NotFoundError;
