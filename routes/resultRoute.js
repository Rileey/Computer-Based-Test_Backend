import { Router } from 'express';
const router = Router();


import ResultController from '../controllers/ResultController.js'

router.route('/result').post(ResultController.createResult)
router.route('/result').get(ResultController.getResult)
router.route('/result/:id').delete(ResultController.deleteResult)
router.route('/result/:id').put(ResultController.updateResult)

export default router