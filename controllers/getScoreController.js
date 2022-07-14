import client from '../database.js';
import Upload from '../utils/multer.js'
import fs from 'fs'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';







const getScoreController =  {
    createScore: async (req, res) => {
        try {
            // console.log(answer1)

            const date = new Date()
            console.log(date, JSON.stringify(req.body))

            let content = JSON.stringify(req.body);
            content += "\n";

            fs.appendFile('cbt.txt', content, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'dejiomoloja@gmail.com',
                  pass: process.env.EMAILPASSWORD
                }
              });

              console.log('created')

            var mailOptions = {
                from: 'dejiomoloja@gmail.com',
                to: 'dejiomoloja@gmail.com',
                subject: 'CBT Test Answers',
                text: `User CBT Answers: ${JSON.stringify(req.body)}`
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

              // const { user_id, score, examnumber, question1, question2, question3, question4, question5, question6 } = req.body
              const {
                user_id,
                examnumber,
                score,
                percentage,
                lastname,
                question1,
                question2,
                question3,
                question4,
                question5,
                question6,
                question7,
                question8,
                question9,
                question10,
                // question11,
                // question12,
                // question13,
                // question14,
                // question15,
                // question16,
                // question17,
                // question18,
                // question19,
                // question20,
                // question21,
                // question22,
                // question23,
                // question24,
                // question25,
                // question26,
                // question27,
                // question28,
                // question29,
                // question30,
                // question31,
                // question32,
                // question33,
                // question34,
                // question35,
                // question36,
                // question37,
                // question38,
                // question39,
                // question40,
                // question41,
                // question42,
                // question43,
                // question44,
                // question45,
                // question46,
                // question47,
                // question48,
                // question49,
                // question50,
            } = req.body
            

            const newScore = await client.query(`INSERT INTO results (user_id, examnumber, score, percentage, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, lastname) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [user_id, examnumber, score, percentage, question1, question2, question3, question4, question5, question6, question7, question8, question9, question10, lastname]
            );
            if (newScore){
                res.status(200).json({message: 'Score created', data: req.body})
            }
        } catch (err) {
            console.error(err)
        }    
    },

    getScore: async (req, res) => {
        try {
            const score = await client.query("SELECT * FROM results");
            res.json({data: score.rows})
        } catch (err) {
            console.error(err.message)
        }
    }
}

export default getScoreController