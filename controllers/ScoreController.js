import client from '../database.js';
import Upload from '../utils/multer.js'

const ScoreController =  {
    createScore: async (req, res) => {
        try {
            const {
                quiz_id,
                answers,
                user_id 
            } = req.body

            

            if (!req.file){
                return res.status(400).json({message: "We need a file"});
            }

            const input = {
                subject, answer
             }
             let question

            if (req.file) { 
            question = req.file.path
            input.question = question; 
        }

            question = req.file

            // if(!subject || !question || !answer) {
            //     return res
            //     .status(400)
            //     .json({message: 'All fields must be provided'})
            // }

            

            const newQuestion = await client.query(`INSERT INTO questions (subject, question, answer) VALUES($1, $2, $3)`,
            [input.subject, input.question, input.answer]
            );
            if (newQuestion){
                res.status(200).json({message: 'Question created', data: input})
            }
        } catch (err) {
            console.error(err.message)
        }
    },

    getQuestion: async (req, res) => {
        try {
            const questions = await client.query("SELECT * FROM questions");
            res.json({data: questions.rows})
        } catch (err) {
            console.error(err.message)
        }
    },

    updateQuestion: async (req, res) => {
        try {
            const { id } = req.params
            const { subject, answer, duration, subject_id } = req.body

            const input = {
                subject, answer, duration, subject_id
             }

             if (req.file) { 
                let question; 
                question = req.file?.path
            input.question = question; 
        }

             const questions = await client.query("SELECT * FROM questions WHERE id = $1", [id])
             const gotQuestions = questions.rows


             if (!input) {
                return questions.rows
             }

            const updateQuestion = await client.query("UPDATE questions SET subject = $1, question = $2, answer = $3, duration = $4, subject_id = $5 WHERE id = $6", 
            [
                input.subject, input.question, input.answer, input.duration, input.subject_id, id
            ])
                res.status(200).json({message: "updated", data: updateQuestion})
            
        } catch (err) {
            console.error(err.message)
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const { id } = req.params
            
           const deleteQuestion = await client.query("DELETE FROM questions WHERE id = $1", [
                id
            ]);
            res.status(200).json({message: 'question deleted'})
        } catch (err) {
            console.error(err.message)
        }
    }
}

export default ScoreController