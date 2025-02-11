import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import Joi from 'joi';

import product from 'models/product';
import BadRequestError from 'errors/bad-request-error';
import ServerError from 'errors/server-error';

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

export const createOrder = (req: Request, res: Response) => {
  try {
    const { error, value } = orderSchema.validate(req.body as IOrder);
    if (error) {
      return (new BadRequestError(`Ошибка валидатора: ${error.message}`));
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

    // Проверяем что товары есть в базе и продаются(price > 0)
    if (products.length !== value.items.length) {
      return new BadRequestError(
        'Ошибка в данных продукта: Не все продукты доступны',
      );
    }

    // Проверяем соответствие суммы
    const productSum = products.reduce((sum, curr) => sum + curr.price, 0);
    if (value.total !== productSum) {
      return new BadRequestError(
        'Ошибка в данных заказа: общая сумма заказа не равна сумме базы данных цен на товары',
      );
    }

    return res.status(200).send({
      id: faker.number.hex({ min: 1000000000, max: 1000000000 }),
      total: productSum,
    });
  } catch (error) {
    return new ServerError(`Server error: ${JSON.stringify(error)}`);
  }
};
