import express from 'express';
import router from express.Router;
import Upload from '../utils/multer.js'
import userRoute from './userRoute.js'
import questionRoute from './questionRoute.js'
import quizRoute from './quizRoute.js'

router.use('/users', userRoute);
router.use('/quiz', quizRoute);
router.use('/questions',  Upload.single('question'), questionRoute);

export default router