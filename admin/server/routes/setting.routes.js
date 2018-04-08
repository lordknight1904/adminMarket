import { Router } from 'express';
import * as SettingController from '../controllers/setting.controller';
const router = new Router();

router.route('/setting').post(SettingController.createSetting);
router.route('/setting').get(SettingController.getSetting);
router.route('/setting').put(SettingController.updateSetting);

export default router;
