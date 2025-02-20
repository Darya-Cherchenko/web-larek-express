import {
  Request, Response, ErrorRequestHandler,
} from 'express';

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Ошибка сервера' : err.message;
  res.status(statusCode).send({ message });
};

export default errorHandler;
