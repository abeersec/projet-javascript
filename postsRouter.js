const express = require('express'); 
const router = express.Router();
const { identifiers } = require('../middlewares/identification');
const postsController = require('../controllers/postsController');

router.get('/all-posts', postsController.getPosts);
router.get('/single-post', postsController.singlePost);
router.post('/create-post', identifiers , postsController.createPost);

router.put('/update-post/:postId', identifiers, postsController.updatePost);
router.delete('/delete-post/:postId', identifiers, postsController.deletePost);

module.exports = router;
