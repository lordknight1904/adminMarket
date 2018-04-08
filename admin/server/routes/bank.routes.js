import { Router } from 'express';
import * as BankController from '../controllers/bank.controller';
const router = new Router();

router.route('/bank').get(BankController.getBank);
router.route('/bank').post(BankController.createBank);
router.route('/bank').put(BankController.updateBank);
router.route('*');

export default router;
