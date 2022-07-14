import { Router } from 'express';
const router = Router();


import getScoreController from '../controllers/getScoreController.js'

router.route('/score').post(getScoreController.createScore)
router.route('/score').get(getScoreController.getScore)

export default router