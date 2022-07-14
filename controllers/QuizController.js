import client from '../database.js';

const QuizController =  {
    createQuiz: async (req, res) => {
        try {
            const { answer } = req.body;
            const question = req.file.path

            if (!req.file){
                return res.status(400).json({message: "We need a file"});
            } 

            const input = {
                answer, question
            }
            console.log(question, "Mr Omoloja")

            


            const newQuiz = await client.query(`INSERT INTO quiz (question, answer) VALUES ($1, $2)`, [
                input.question, input.answer
            ])

            if ( newQuiz ) {
                res.status(200).json({message: "Subject Created", data: input})
            }
        } catch (err) {
            console.error(err.message)
        }
    },

    getQuiz: async (req, res) => {
        
        try {
            const quiz = await client.query("SELECT * FROM quiz order by random() limit 10");
            res.json({data: quiz.rows})
        } catch (err) {
            console.error(err.message)
        }
    },

    getOneQuiz: async (req, res) => {
        try {
            const { quiz_id } = req.params
            const findquiz = await client.query("SELECT * FROM quiz WHERE quiz_id = $1;", [quiz_id]);
            const foundquiz = findquiz.rows
            res.json({data: foundquiz})
        } catch (err) {
            console.error(err.message)
        }
    },

    updateQuiz: async (req, res) => {
        try {
            const { quiz_id } = req.params
            const { answer } = req.body;
            if (req.file){
                const question = req.file.path
                await client.query('UPDATE quiz SET question = $1 WHERE quiz_id = $2', [
                    question, quiz_id
                ])    
            }
            if (answer){
                await client.query(
                    "UPDATE quiz SET answer = $1 WHERE quiz_id = $2",
                    [answer, quiz_id]
                    )
            }

                res.status(200).json({message: 'title has been updated'})
        } catch (err) {
            console.error(err.message)
        }
    },

    deleteQuiz: async (req, res) => {
        try {
            const { quiz_id } = req.params
            
           await client.query("DELETE FROM quiz WHERE quiz_id = $1", [
                quiz_id
            ]);
            res.status(200).json({message: 'Quiz deleted'})
        } catch (err) {
            console.error(err.message)
        }
    }
}

export default QuizController