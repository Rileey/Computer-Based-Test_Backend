import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import client from '../database.js';
import validatePassword from '../utils/validatePassword.js';
import emailValidation from '../utils/validateEmail.js';
import {generateToken} from '../utils/generateToken.js';


const AuthController = {
    //create a new user - post method
    signup: async (req, res) => {
        const {firstname, lastname, email, password, examnumber} = req.body 

        try {
            if(!firstname || !lastname || !email || !password || !examnumber) {
                return res
                .status(400)
                .json({message: 'All fields must be provided'})
            }

            if(!emailValidation(email)) {
                return res.status(400).json({message: 'Enter a valid email address'})
            }

            if(password.length < 7) {
                return res.status(400).json({message: 'Password should not be less than 7 characters'})
            }

            if(!validatePassword(password)) {
                return res.status(400).json({message: 'Password must be alphanumeric characters'})
            }

            //Checking if user already exists
            const findUser = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
            const foundUser = findUser.rows
            // console.log("find user", foundUser)

            if(foundUser.length !== 0) {
                return res.status(400).json({message: 'User already exist. Please login'})
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt)

            const user = {
                firstname, lastname, email, password:hash, examnumber
            }

            if (hash) {
            const newUser = await client.query(`INSERT INTO users (firstname, lastname, email, password, examnumber) VALUES($1, $2, $3, $4, $5)`,
            [user.firstname, user.lastname, user.email, user.password, user.examnumber]
            )

            if (newUser){
                jwt.sign(
                    { email: user.email},
                    process.env.SECRET,
                        {expiresIn: 3600},
                        (err, token) => {
                            if (err) {
                                throw err
                            }
                            console.log(newUser._doc, newUser.rows)
                            res.json({success:'New user has been created', data: {token: `Bearer ${token}`, firstname: newUser.firstname, lastname: newUser.lastname, email: newUser.email, examnumber: newUser.examnumber}})
                        }
                )
            } 
        }
            } catch (err) {
                console.error(err.message)
            }
            
    },

    //login a user - post method
    login: async (req, res) => {
        try {
            const { examnumber, password } = req.body
            if (!examnumber || !password){
                return res.status(400).json({message: 'All fields must be provided'})
            }

            //Checking if user already exists
            const findUser = await client.query(`SELECT * FROM users WHERE examnumber = $1;`, [examnumber]);
            const foundUser = findUser.rows


            if(foundUser) {
                const validPassword = bcrypt.compare(password, foundUser.hash)

                if (validPassword) {
                    return res.status(200).json({
                        message: 'Password is correct',
                        token: `Bearer ${generateToken(foundUser)}`,
                        data: foundUser[0]
                    })
                } else {
                    return res.status(401).json({message: "Incorrect examnumber or password, try again!"})
                }
            } else {
                res.status(401).json({message: "User not found"})
            }
            // return res.status(401).json({message: 'Incorrect examnumber or password'})
        } catch (err) {
            console.error(err.message)
        }
    },

    //fetch all the users - get method
    users: async (req, res) => {
        try {
            const users = await client.query("SELECT * FROM users");
            res.json({data: users.rows})
        } catch (err) {
            console.error(err.message)
        }
    },

    //fetch a user - get method
    user: async (req, res) => {
        try {
            const { user_id } = req.params
            const findUser = await client.query("SELECT * FROM users WHERE user_id = $1;", [user_id]);
            const foundUser = findUser.rows
            res.json({data: foundUser})
        } catch (err) {
            console.error(err.message)
        }
    }
}

export default AuthController