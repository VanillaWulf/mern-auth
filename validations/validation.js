import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть длинее 5 символов').isLength({ min: 5 }),
    body('fullName', 'имя должно быть длинее 3 символов').isLength({ min: 3 }),
    body('avatar', 'неверная ссылка').optional().isURL()
];

export const loginValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен быть длинее 5 символов').isLength({ min: 5 }),
];

export const postCreateValidation = [
    body('title', 'маленький title').isLength({ min: 5 }).isString(),
    body('text', 'маленький text').isLength({ min: 10 }).isString(),
    body('tags').optional().isArray(),
    body('imageUrl', 'неверная ссылка на каритнку').optional().isString()
];
