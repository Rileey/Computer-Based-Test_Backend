import client from '../database.js';

const QuizController =  {
    createQuiz: async (req, res) => {
        try {
            const { answer, option_1, option_2, option_3, option_4, option_5 } = req.body;
            const question = req.file.path

            if (!req.file){
                return res.status(400).json({message: "We need a file"});
            } 

            const input = {
                answer, question, option_1, option_2, option_3, option_4, option_5
            }
            
            // if (req.file) {
            //     const question = req.file.path
            //     input.question = question
            // }

           

            console.log(question)

            


            const newQuiz = await client.query(`INSERT INTO quiz (question, answer, option_1, option_2, option_3, option_4, option_5) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                input.question, input.answer, input.option_1, input.option_2, input.option_3, input.option_4, input.option_5
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
            const subjects = await client.query("SELECT * FROM quiz");
            res.json({data: subjects.rows})
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
            const { answer, option_1, option_2, option_3, option_4, option_5 } = req.body;
            if (req.file){
                const question = req.file.path
                await client.query('UPDATE quiz SET question = $1 WHERE quiz_id = $2', [
                    question, quiz_id
                ])    
            }

            if (option_1) {
                await client.query(
                    "UPDATE quiz SET option_1 = $1 WHERE quiz_id = $2",
                    [option_1, quiz_id]
                )
            }
            if (option_2) {
                await client.query(
                    "UPDATE quiz SET option_2 = $1 WHERE quiz_id = $2",
                    [option_2, quiz_id]
                )
            }
            if (option_3) {
                await client.query(
                    "UPDATE quiz SET option_3 = $1 WHERE quiz_id = $2",
                    [option_3, quiz_id]
                )
            }
            if (option_4) {
                await client.query(
                    "UPDATE quiz SET option_4 = $1 WHERE quiz_id = $2",
                    [option_4, quiz_id]
                )
            }
            if (option_5) {
                await client.query(
                    "UPDATE quiz SET option_5 = $1 WHERE quiz_id = $2",
                    [option_5, quiz_id]
                )
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
                id
            ]);
            res.status(200).json({message: 'Quiz deleted'})
        } catch (err) {
            console.error(err.message)
        }
    }
}

export default QuizController