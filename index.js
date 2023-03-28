import express from 'express';
import multer from 'multer';
import mongoose from "mongoose";
import cors from 'cors';
import { registerValidation, loginValidation } from './validations/validation.js';
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { UserController, PostController } from "./constollers/index.js";

import { postCreateValidation } from "./validations/validation.js";


mongoose.connect('mongodb+srv://admin:72405060@cluster0.vhuv29j.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log(('db ok'))
    }).catch((err) => { console.log('err' + err) });

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());

app.get('/', (req, res) => {
    res.send('hallo world');
});

app.use(cors());

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.use('/uploads', express.static('uploads'));

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
});

