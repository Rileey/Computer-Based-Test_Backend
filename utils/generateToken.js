import jwt from 'jsonwebtoken';


export const generateToken = (user) => {
    return jwt.sign({
        user_id: user.user_id,
        firstnaname: user.firstnaname,
        lastname: user.lastname,
        email: user.email,
    },
    process.env.SECRET,
    {
        expiresIn: 3600
    }
    )
}