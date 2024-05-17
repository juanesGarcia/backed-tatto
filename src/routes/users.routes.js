
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
    

} =require("../controllers/usersController")
const pool = require("../constants/db");
const router = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });




const {
    registerValidator, 
    loginValidation,
    updateValidator} = require("../validators/users");
const { validationMiddleware } = require("../middlewares/validation-middleware");
const {userAuth} = require("../middlewares/users-middleware");


router.get('/',async(req, res) => {
    try {
     const result = await pool.query('  select  * from users ');
      res.json(result.rows)
    } catch (error) {
        console.log(error.message)
    }
   
} );

router.get('/user',getUsers);
router.get('/userwithrating',getUsersWithRating);
router.get('/protected',userAuth,protected);
router.get('/logout',logout);
router.post('/register',registerValidator,validationMiddleware,register);
router.post('/login',loginValidation,validationMiddleware,login);
router.patch('/user/:id',userAuth, updateValidator,validationMiddleware,updateUser);
router.delete('/user/:id',userAuth,deleteUser);
router.post('/verify-token',verifyToken );
router.get('/user/:id',getUser);
router.get('/userInfo/:id',getUserInfo);
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