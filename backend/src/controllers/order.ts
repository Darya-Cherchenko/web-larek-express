import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { Joi, celebrate, Segments } from 'celebrate';

import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';
import Product from '../models/product';

export interface IOrder {
  items: string[],
  total: number,
  payment: string,
  email: string,
  phone: string,
  address: string,
}

const orderSchema = Joi.object<IOrder>({
  items: Joi.array().required(),
  total: Joi.number().required(),
  payment: Joi.equal('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/)
    .required(),
  address: Joi.string().required(),
});

export const orderRouteValidator = celebrate({
  [Segments.BODY]: orderSchema,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = orderSchema.validate(req.body as IOrder);
    if (error) {
      return next(new BadRequestError(`Ошибка проверки: ${error.message}`));
    }

    const products = (
      await Product.find({
        _id: {
          $in: value.items.map(
            (item: string) => new mongoose.Types.ObjectId(item),
          ),
        },
      })
    ).filter((product) => !!product.price);

    if (products.length !== value.items.length) {
      return next(
        new BadRequestError(
          'Ошибка в данных продукта: Не все продукты доступны',
        ),
      );
    }

    const productSum = products.reduce((sum, curr) => sum + (curr.price || 0), 0);
    if (value.total !== productSum) {
      return next(
        new BadRequestError(
          'Ошибка в данных заказа: общая сумма заказа не равна сумме базы данных цен на товары',
        ),
      );
    }

    return res.status(200).send({
      id: faker.number.hex({ min: 1000000000, max: 1000000000 }),
      total: productSum,
    });
  } catch (error) {
    return next(new ServerError(`Ошибка сервера: ${JSON.stringify(error)}`));
  }
};
