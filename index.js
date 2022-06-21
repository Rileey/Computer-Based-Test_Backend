import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import client from './database.js'
// import Upload from './utils/multer.js'
// import path from 'path'



const app = express(); //listens to incomng connections
dotenv.config();

import userRoute from './routes/userRoute.js'
import scoreRoute from './routes/scoreRoute.js'
import quizRoute from './routes/quizRoute.js'


app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    parameterLimit: 1000000,
    extended: false
}));



app.listen(8800, ()=> {
    console.log("Server now listening on port 8800")
})


app.get('/', (req, res) => {
    res.json({message: 'server is ready'});
})

//routes
app.use('/api', userRoute);
app.use('/api', scoreRoute)
app.use('/api', quizRoute)
app.use('/api/uploads', express.static('./uploads'));


// app.post('/api/image', Upload.single('question'), (req, res) => {
//     res.json('/image api'); 
// });

// app.get('/api/image/:filename', (req, res) => {
//     const { filename } = req.params;
//     const dirname = path.resolve();
//     const fullfilepath = path.join(dirname, 'TestPapers/' + filename);
//     return res.sendFile(fullfilepath);
//     res.json('/image/:filename api');
// });

client.connect()