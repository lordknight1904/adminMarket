import { Router } from 'express';
import * as TransactionController from '../controllers/transaction.controller';
const router = new Router();

router.route('/transaction/fee/:date/:coin').get(TransactionController.getTransacitonFee);
router.route('/transaction').get(TransactionController.getTransaction);
router.route('/transaction/hash/:coin/:txHash').get(TransactionController.getHash);
router.route('/transaction/fix').post(TransactionController.fix);

export default router;
