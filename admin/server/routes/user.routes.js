import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

router.route('/user').get(UserController.getUser);
router.route('/user/statistic').get(UserController.getUserStatistic);
router.route('/user').put(UserController.approveUser);

export default router;
