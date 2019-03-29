const express=require('express');
const router=express.Router();

var controller = require('../controllers/users');
var checkAuth=require('../middleware/check-auth');



router.post('/addAllUsers',controller.addAllUsers);
router.post('/addAllPostAndComments',controller.addAllPostAndComments);
router.post('/signIn',controller.signIn);
router.get('/allUsers',checkAuth,controller.fetchAllUser);
router.get('/allUserPosts',checkAuth,controller.fetchAllUserPost)
router.post('/updateUserPhone',checkAuth,controller.updateUserPhone)



module.exports=router;


