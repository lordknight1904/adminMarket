import { Router } from 'express';
import * as OrderController from '../controllers/order.controller';
const router = new Router();

router.route('/order').post(OrderController.createOrder);
router.route('/order').delete(OrderController.deleteOrder);
router.route('/order/:coin/:type').get(OrderController.getOrder);
router.route('/order/individual/:coin/:userName').get(OrderController.getMyOrder);
router.route('/order/statistic/:date/:coin').get(OrderController.getOrderStatistic);

export default router;
