import { Router } from 'express';
import { createOrder, orderRouteValidator } from '../controllers/order';

const routerOrder = Router();

routerOrder.post('/order', orderRouteValidator, createOrder);

export default routerOrder;
