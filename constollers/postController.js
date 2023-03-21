import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (e) {
        res.status(500).json({
            message: 'no article in bd'
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        try {
            const post = await PostModel.findOneAndUpdate({_id: postId},
                {
                    $inc: {viewCount: 1}
                }, {
                    returnDocument: 'after'
                },
            );
            if(!post) {
                return res.status(404).json({
                    message: 'no article in bd'
                }
            )}

            return res.json(post);

        } catch (e) {
            return res.status(500).json({
                message: 'error in find article'
            });
        }
    } catch (e) {
        res.status(500).json({
            message: 'no article in bd'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        try {
            const post = await PostModel.findOneAndDelete({
                _id: postId
            });
            if (!post) {
                return res.status(404).json({
                    message: 'no article found'
                });
            }
            res.json({
                success: true
            })
        } catch (e) {
            return res.status(500).json({
                message: 'error in deleting article'
            });
        }

    } catch (e) {
        res.status(500).json({
            message: 'no article in bd'
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imgUrl: req.body.imgUrl,
            tags: req.body.tags,
            user: req.userId
        });

        res.json({
            success: true
        })
    } catch (e) {
        res.status(500).json({
            message: 'no article in bd'
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imgUrl: req.body.imgUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();
        res.json(post);
    } catch(e) {
        res.status(500).json({
            message: 'no article added'
        });
    }
};
