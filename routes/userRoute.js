import { Router } from 'express';
const router = Router();

import AuthController from '../controllers/AuthController.js';

router.route('/register').post(AuthController.signup);
router.route('/login').post(AuthController.login);
router.route('/users').get(AuthController.users);
router.route('/users/:user_id').get(AuthController.user);
// router.route('/login').post(AuthController.login);

export default router;