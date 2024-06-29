const { Router } = require("express");

const router = Router();
const {
    getUsers,
    getUsersWithRating,
    updateUser,
    deleteUser,
    getUser,
    getUserInfo,
    updatelocation,
    uploadImagesProfile

} =require("../controllers/usersController")

const {

    updateValidator} = require("../validators/users");
 const { validationMiddleware } = require("../middlewares/validation-middleware");
 const {userAuth} = require("../middlewares/users-middleware");

router.get('/users',getUsers);
router.get('/', (req, res) => {
    res.send('micro funcionando bien users');
});

router.get('/userwithrating',getUsersWithRating);
router.put('/user/:id',updateUser);
router.delete('/user/:id',deleteUser);
router.get('/user/:id',getUser);
router.get('/userInfo/:id',getUserInfo);
router.post('/updatelocation',updatelocation);
router.post('/uploadimg/:id',uploadImagesProfile);


module.exports = router;