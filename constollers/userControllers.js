import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register =  async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user.id
            }, 'secret123',
            {
                expiresIn: '30d'
            }
        );

        /*вытаскиваем поле пасхэш из дока десруктуризацией*/
        const {passHash, ...userData} = user._doc;

        res.json({...userData, token});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'couldnt register'
        })
    }
}

export const login =  async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'pass or login not found'
            })
        }

        const token = jwt.sign(
            {
                _id: user.id
            }, 'secret123',
            {
                expiresIn: '30d'
            }
        );

        const {passHash, ...userData} = user._doc;

        res.json({...userData, token});
    } catch (err) {
        res.status(500).json({
            message: 'couldnt auth'
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'no user in db'
            })
        }
        const token = jwt.sign(
            {
                _id: user.id
            }, 'secret123',
            {
                expiresIn: '30d'
            }
        );

        const {passHash, ...userData} = user._doc;
        res.json({...userData});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'no access'
        })
    }
};
