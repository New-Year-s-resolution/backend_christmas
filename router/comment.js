const express = require('express');
const router = express.Router();

const sanitize = require('../lib/sanitizeHtml');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const ERROR = require('../data/error')
require('moment-timezone');
require('dotenv').config();

const { Post, Comment, User } = require('../schemas');

// 댓글 리스트
router.get('/:postId', async (req, res) => {
	const postId = req.params.postId;
    let data = {}, userId, commentsItems;
    let postItem;
    
	try {
        postItem = await Post.findOne({ post_id: postId})

        if(!postItem){
            throw new Error(ERROR.NO_EXISTS_DATA)
        }

        commentsItems = await Comment.find({ comment_target_id: postId })
			.sort('createdAt')
            .lean()

        if(!commentsItems){
            throw new Error(ERROR.NO_EXISTS_DATA);
        }

        data = {
            items: commentsItems,
            total: commentsItems.length
        }

        res.json({ msg: 'success', data }) 

	} catch(err){
        console.log('err', err)
        res.json({ msg : 'fail'})
    }
});

// 댓글 입력
router.post('/:postId', async (req, res) => {
	const postId = req.params.cardId;
	// const user = res.locals.user;

    if(!user) { 
        throw new Error(ERROR.INVALID_AUTH);
    }

	try {

		let data = {
			comment_target_id: postId,
			comment_content: sanitize(req.body.commentContents),
			user_id: sanitize(user.id),
			created_at: moment().format('YYYY-MM-DDT+'),
			date: Date.now()
		};

		await Comment.create(data);

		res.json({ msg: 'success', result: result });
	} catch (err) {
		console.log(err);
		res.json({ msg: 'fail' });
	}
});

// 댓글 삭제
router.delete('/:commentId', async (req, res) => {
    const uid = req.params.commentId;
	const user = res.locals.user;

    if(!user) { 
        throw new Error(ERROR.INVALID_AUTH);
    }

	try {
		let commentItem = await Comment.findOne({ _id: uid, userId: user.id });

        if (!commentItem){
            throw new Error(ERROR.NO_EXISTS_DATA)
        }

		const { deletedCount } = await Comment.deleteOne({ _id: commentItem._id, userId: user.id });
		if (!deletedCount){
            throw new Error(ERROR.FAILURE_DATA)
        }

	}catch(err){
        console.log('err', err);
        res.json({ msg: 'fail'})
    }

});

module.exports = router;