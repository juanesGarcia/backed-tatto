
const { Router } = require("express");
const {
    getUsers,
    register,
    login,
    protected, 
    logout,
    getUser, 
    updateUser,
    deleteUser,
    verifyToken,
    uploadImages,
    getImages, 
    deleteImages,
    editarTitleImages,
    follow, 
    followed,
    follower,
    checkFollowingStatus,
    unfollow,
    reactions,
    checkreactions,
    unreaction,
    getReaction,
    updatelocation,
    rating,
    getRating,
    yetRating,
    getUsersWithRating,
    uploadImagesProfile,
    getUserInfo,
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
    getRatingMicro

} =require("../controllers/usersController")
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

router.get('/',main);
router.get('/users',getusersMicroservices);
router.get('/userwithrating',getUsersWithRatingMicro);
router.put('/user/:id',userAuth,updateValidator,validationMiddleware,updateUserMicro);
router.delete('/user/:id',userAuth,deleteUserMicro);
router.get('/user/:id',getUserMicro);
router.get('/userInfo/:id',getUserInfoMicro);
router.get('/protect',userAuth,protected);
router.post('/updatelocation',updatelocation);
router.get('/logout',logoutMicro);
router.post('/register',registerValidator,validationMiddleware,registerMicro);
router.post('/login',loginValidation,validationMiddleware,loginMicro);
router.post('/upload/:id',upload.array('photo', 5),uploadImages);
router.get('/getimages/:id',getImages)
router.delete('/deleteimages/:postId', deleteImages);
router.put('/editar/:postId',editarTitleImages);
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
router.post('/uploadimg/:id',upload.array('photo', 1),uploadImagesProfile);






module.exports = router;