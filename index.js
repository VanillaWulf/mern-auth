import express from 'express';
import mongoose from "mongoose";
import { registerValidation, loginValidation } from './validations/validation.js';
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./constollers/userControllers.js";


mongoose.connect('mongodb+srv://admin:72405060@cluster0.vhuv29j.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log(('db ok'))
    }).catch((err) => {console.log('err'+ err)});

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hallo world');
});

app.post('/auth/register', registerValidation, UserController.register);

app.post('/auth/login', loginValidation, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(4444, (err) =>{
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
});

