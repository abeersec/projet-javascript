const { identifiers } = require('../middlewares/identification');

const express = require('express'); 
const authController = require('../controllers/authoController')
const router = express.Router();

router.post('/signup', authController.signup );
router.post('/signin', authController.signin );

module.exports = router;