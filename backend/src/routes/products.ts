import { Router } from 'express';
import { getProducts, createProduct, productRouteValidator } from '../controllers/products';

const routerProduct = Router();

routerProduct.get('/product', getProducts);
routerProduct.post('/product', productRouteValidator, createProduct);

export default routerProduct;
