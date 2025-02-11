/* eslint-disable linebreak-style */
import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/products';

const routerProduct = Router();

routerProduct.get('/', getProducts);
routerProduct.post('/', createProduct);

export default routerProduct;
