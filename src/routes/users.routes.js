
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
    getUrls,
    

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
router.get('/protected',userAuth,protected);
router.get('/logout',logout);
router.post('/register',registerValidator,validationMiddleware,register);
router.post('/login',loginValidation,validationMiddleware,login);
router.put('/user/:id',userAuth, updateValidator,validationMiddleware,updateUser);
router.delete('/user/:id',userAuth,deleteUser);
router.post('/verify-token',verifyToken );
router.get('/user/:id',getUser);
router.post('/upload',upload.single('photo'),uploadImages);
router.get('/images',getImages)
router.get('/images/:imageName',getUrls)







module.exports = router;