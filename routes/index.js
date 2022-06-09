import express from 'express';
import router from express.Router;

import userRoute from './userRoute.js'
// import subjectRoute from ''

router.use('/users', userRoute);
router.use('/subjects', subjectRoute);

export default router