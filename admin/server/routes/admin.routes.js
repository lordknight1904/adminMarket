import { Router } from 'express';
import * as AdminController from '../controllers/admin.controller';
const router = new Router();

router.route('/admin').get(AdminController.getAdmin);
router.route('/admin').post(AdminController.createAdmin);
router.route('/admin/delete').post(AdminController.deleteAdmin);
router.route('/admin/recover').post(AdminController.recoverAdmin);
router.route('/admin/login').post(AdminController.loginAdmin);

export default router;
