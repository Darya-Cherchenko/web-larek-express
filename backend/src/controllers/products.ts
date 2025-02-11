/* eslint-disable linebreak-style */
import { Request, Response } from 'express';
import product from '../models/product';

export const getProducts = (_req: Request, res: Response) => product.find({})
  .then((products) => {
    res.send({ items: products, total: products.length });
  })
  .catch((error) => res.send(error.message));

export const createProduct = (req: Request, res: Response) => {
  const {
    title, image, category, description, price,
  } = req.body;

  return product.create({
    title, image, category, description, price,
  })
    .then((newProduct) => res.send({ data: newProduct }))
    .catch((error) => {
      res.send({ message: 'Произошла ошибка', error });
    });
};
