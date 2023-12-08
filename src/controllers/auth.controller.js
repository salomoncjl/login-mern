import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'


export const register = async (req, res) => {
    const {email, password, username} = req.body
    // console.log(email, password, username);
    
    try {
        
        const passwordHash = await bcrypt.hash(password, 10) // Nos da un string cualquiera
        
        const newUser = new User({
            username,
            email,
            password : passwordHash
        });
        
        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie('token', token);
  
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            message: 'Usuario creado'
        })
      
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

export const login = async (req, res) => {
    const {email, password} = req.body
    
    try {

        const userFound = await User.findOne({email})
        if (!userFound) return res.status(400).json({ messague: 'User not found'});

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ messague: 'Incorrect password' });
        
        const token = await createAccessToken({ id: userFound._id });

        res.cookie('token', token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            message: 'Usuario logeado'
        }) 
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
}