import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from './validations/auth.js'

mongoose.connect('mongodb+srv://admin:72405060@cluster0.vhuv29j.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log(('db ok'))
    }).catch((err) => {console.log('err'+ err)});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hallo world');
});

app.post('/auth/register', registerValidation, (req, res) => {
    const error = validationResult(req);
    if(error.isEmpty()) {
        return res.status(400).json(error.array())
    }

    res.json({
        success: true
    })
});

app.post('/auth/login', (req,res) => {
    const token = jwt.sign({
        email: req.body.email,
        fullName: 'Any'
    }, 'secretHash');
    res.json({
        success: true,
        token
    })
});

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
});

