/* eslint-disable linebreak-style */
import {
  Request, Response, ErrorRequestHandler,
} from 'express';

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server error' : err.message;
  res.status(statusCode).send({ message });
};

export default errorHandler;
