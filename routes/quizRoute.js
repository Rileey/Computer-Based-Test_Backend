import { Router } from 'express';
const router = Router();
import Upload from '../utils/multer.js'

import QuizController from '../controllers/QuizController.js'

router.route('/quiz').post(Upload.single('question'), QuizController.createQuiz)
router.route('/quiz').get(QuizController.getQuiz)
router.route('/quiz/:quiz_id').get(QuizController.getOneQuiz)
router.route('/quiz/:quiz_id').put(QuizController.updateQuiz)

export default router