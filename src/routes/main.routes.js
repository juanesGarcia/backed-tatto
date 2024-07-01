
const { Router } = require("express");
const {
    getusersMicroservices,
    main,
    getUsersWithRatingMicro,
    updateUserMicro,
    getUserMicro,
    deleteUserMicro,
    getUserInfoMicro,
    logoutMicro,
    loginMicro,
    registerMicro,
    followMicro,
    unfollowMicro,
    checkFollowingMicro,
    followerMicro,
    followedMicro,
    reactionsMicro,
    unReactionsMicro,
    checkreactionsMicro,
    getReactionMicro,
    ratingMicro,
    yetRatingMicro,
    getRatingMicro,
    updatelocationMicro,
    uploadImagesProfileMicro,
    uploadImagesMicro,
    getImagesMicro,
    deleteImagesMicro,
    editarTitleImagesMicro

} =require("../controllers/microserverController")
const router = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });





const {
    registerValidator, 
    loginValidation,
    updateValidator} = require("../validators/users");
const { validationMiddleware } = require("../middlewares/validation-middleware");
const {userAuth} = require("../middlewares/users-middleware");

//router.get('/userwithout',getUsers);
//router.post('/verify-token',verifyToken );
//router.get('/protect',userAuth,protected);
router.get('/', (req, res) => {
    res.send('micro funcionando bien main');
});

router.get('/users',getusersMicroservices);
router.get('/userwithrating',getUsersWithRatingMicro);
router.put('/user/:id',userAuth,updateValidator,validationMiddleware,updateUserMicro);
router.delete('/user/:id',userAuth,deleteUserMicro);
router.get('/user/:id',getUserMicro);
router.get('/userInfo/:id',getUserInfoMicro);
router.post('/updatelocation',updatelocationMicro);
router.get('/logout',logoutMicro);
router.post('/register',registerValidator,validationMiddleware,registerMicro);
router.post('/login',loginValidation,validationMiddleware,loginMicro);
router.post('/upload/:id',upload.array('photo', 5),uploadImagesMicro);
router.get('/getimages/:id',getImagesMicro)
router.delete('/deleteimages/:postId', deleteImagesMicro);
router.put('/editar/:postId',editarTitleImagesMicro);
router.post('/followUser',followMicro)
router.post('/unFollowUser',unfollowMicro)
router.get('/followed/:id',followedMicro);
router.get('/follower/:id',followerMicro);
router.post('/checkfollowing',checkFollowingMicro);
router.post('/reaction',reactionsMicro);
router.post('/checkreactions',checkreactionsMicro);
router.post('/unreaction',unReactionsMicro);
router.get('/getreactions/:id',getReactionMicro);
router.post('/rating',ratingMicro);
router.get('/getRating/:id',getRatingMicro);
router.post('/yetrating',yetRatingMicro);
router.post('/uploadimg/:id',upload.array('photo', 1),uploadImagesProfileMicro);






module.exports = router;