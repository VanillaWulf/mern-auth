import jwt from 'jsonwebtoken';

export default (req,res, next) => {

    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            /*user id from db*/
            req.userId = decoded._id;
            /* next step*/
            next();
        } catch (e) {
            return res.status(403).json({
                message: 'no access'
            })
        }
    } else {
        return res.status(404).json({
            message: 'no access'
        })
    }
}
