import { Router } from 'express';
import * as MarketOrderController from '../controllers/marketOrder.controller';
const router = new Router();

router.route('/market').get(MarketOrderController.getMarketOrders);
router.route('/market/refresh').post(MarketOrderController.marketOrderRefresh);
router.route('/market/auto').post(MarketOrderController.marketOrderAuto);

export default router;
