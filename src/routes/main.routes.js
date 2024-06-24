
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
    registerMicro

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


router.get('/',main);
router.get('/users',getusersMicroservices);
//router.get('/userwithout',getUsers);
router.get('/userwithrating',getUsersWithRatingMicro);
router.put('/user/:id',userAuth,updateValidator,validationMiddleware,updateUserMicro);
router.delete('/user/:id',userAuth,deleteUserMicro);
router.get('/user/:id',getUserMicro);
router.get('/userInfo/:id',getUserInfoMicro);
router.get('/protect',userAuth,protected);
router.get('/logout',logoutMicro);
router.post('/register',registerValidator,validationMiddleware,registerMicro);
router.post('/login',loginValidation,validationMiddleware,loginMicro);
router.post('/verify-token',verifyToken );
router.post('/upload/:id',upload.array('photo', 5),uploadImages);
router.get('/getimages/:id',getImages)
router.delete('/deleteimages/:postId', deleteImages);
router.put('/editar/:postId',editarTitleImages);
router.post('/followUser',follow)
router.post('/unFollowUser',unfollow)
router.get('/followed/:id',followed);
router.get('/follower/:id',follower);
router.post('/checkfollowing',checkFollowingStatus);
router.post('/reactions',reactions);
router.post('/checkreactions',checkreactions);
router.post('/unreaction',unreaction);
router.post('/updatelocation',updatelocation);
router.get('/getreactions/:id',getReaction);
router.post('/rating',rating);
router.get('/getRating/:id',getRating);
router.post('/yetrating',yetRating);
router.post('/uploadimg/:id',upload.array('photo', 1),uploadImagesProfile);






module.exports = router;