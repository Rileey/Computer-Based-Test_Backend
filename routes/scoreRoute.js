import { Router } from 'express';
const router = Router();


import ScoreController from '../controllers/ScoreController.js'

router.route('/score').post(ScoreController.createScore)
router.route('/score').get(ScoreController.getQuestion)
router.route('/score/:id').delete(ScoreController.deleteQuestion)
router.route('/score/:id').put(ScoreController.updateQuestion)

export default router