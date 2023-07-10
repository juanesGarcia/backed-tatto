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
    verifyToken

} =require("../controllers/usersController")
const router = Router();
const {
    registerValidator, 
    loginValidation} = require("../validators/users");
const { validationMiddleware } = require("../middlewares/validation-middleware");
const {userAuth} = require("../middlewares/users-middleware");


router.get('/user',getUsers);
router.get('/protected',userAuth,protected);
router.get('/logout',logout);
router.post('/register',registerValidator,validationMiddleware,register);
router.post('/login',loginValidation,validationMiddleware,login);
router.put('/user/:id',userAuth,updateUser);
router.delete('/user',userAuth,deleteUser);
router.post('/verify-token',verifyToken );





module.exports = router;