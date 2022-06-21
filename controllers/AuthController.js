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
        const {firstname, lastname, password, confirmpassword, examnumber, isadmin} = req.body 

        console.log(req.body)

        try {
            if(!firstname || !lastname || !password || !confirmpassword|| !examnumber || !isadmin) {
                return res
                .status(400)
                .json({message: 'All fields must be provided'})
            }

            // if(!emailValidation(email)) {
            //     return res.status(400).json({message: 'Enter a valid email address'})
            // }

            if(password.length < 7) {
                return res.status(400).json({message: 'Password should not be less than 7 characters'})
            }

            if (confirmpassword !== password) {
                return res.status(400).json({message: 'Password does not match'})
            }

            // if(!validatePassword(password)) {
            //     return res.status(400).json({message: 'Password must be alphanumeric characters'})
            // }

            //Checking if user already exists
            const findUser = await client.query(`SELECT * FROM users WHERE examnumber = $1;`, [examnumber]);
            const foundUser = findUser.rows

            if(foundUser.length !== 0) {
                return res.status(400).json({message: 'User already exist. Please login'})
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt)


            const user = {
                firstname, lastname, password:hash, confirmpassword:hash, examnumber, isadmin 
            }

            if (hash) {
            const newUser = await client.query(`INSERT INTO users (firstname, lastname, password, confirmpassword, examnumber, isadmin) VALUES($1, $2, $3, $4, $5, $6)`,
            [user.firstname, user.lastname, user.password, user.confirmpassword, user.examnumber, user.isadmin]
            )

            if (newUser){
                jwt.sign(
                    { examnumber: user.examnumber},
                    process.env.SECRET,
                        {expiresIn: 3600},
                        (err, token) => {
                            if (err) {
                                throw err
                            }
                            res.json({success:'New user has been created', data: {token: `Bearer ${token}`, firstname: user.firstname, lastname: user.lastname, examnumber: user.examnumber, isadmin: user.isadmin}})
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
            const foundUser = findUser.rows[0]
            if(foundUser) {
                const validPassword = bcrypt.compareSync(password, foundUser.password)

                
                if (validPassword) {
                    return res.status(200).json({
                        message: 'Password is correct',
                        token: `Bearer ${generateToken(foundUser)}`,
                        data: foundUser
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
    },

    //update a user - put method
    updateUser: async (req, res) => {
        try {
            const { user_id } = req.params;
            const { firstname, lastname, email, password, isadmin } = req.body;

            console.log(req.body)

            const input = {
                firstname, lastname, email, password, isadmin
            }

            if (input.firstname){
                await client.query('UPDATE users SET firstname = $1 WHERE user_id = $2', [
                    input.firstname, user_id
                ])
            }
            if (input.lastname) {
                await client.query('UPDATE users SET lastname = $1 WHERE user_id = $2', [
                    input.lastname, user_id
                ])
            }
            if (input.email) {
                await client.query('UPDATE users SET email = $1 WHERE user_id = $2', [
                    input.email, user_id
                ])
            }
            if (input.password) {
                await client.query('UPDATE users SET password = $1 WHERE user_id = $2', [
                    input.password, user_id
                ])
            }
            if (input.isadmin) {
                await client.query('UPDATE users SET isadmin = $1 WHERE user_id = $2', [
                    input.isadmin, user_id
                ])
            }
             return res.status(200).json({message: 'updated', data: input})
        } catch (err) {
            console.error("error:", err)
        }
    },

    deleteUser : async ( req, res ) => {
        try {
            const { user_id } = req.params
            
           await client.query("DELETE FROM users WHERE user_id = $1", [
                user_id
            ]);
            res.status(200).json({message: 'users deleted'})
        } catch (err) {
            console.error(err)
        }
    }
}

export default AuthController