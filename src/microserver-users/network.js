const { Router } = require("express");
const pool = require("../databases/db");
const router = Router();
const {
    getUsers,
    getUsersWithRating,
    updateUser,
    deleteUser,
    getUser,
    getUserInfo

} =require("../controllers/usersController")

const {

    updateValidator} = require("../validators/users");
 const { validationMiddleware } = require("../middlewares/validation-middleware");
 const {userAuth} = require("../middlewares/users-middleware");

router.get('/users',getUsers);
router.get('/', (req, res) => {
    res.send('microservicio funcionando bien');
});

router.get('/userwithrating',getUsersWithRating);
router.put('/user/:id',updateUser);
router.delete('/user/:id',userAuth,deleteUser);
router.get('/user/:id',getUser);
router.get('/userInfo/:id',getUserInfo);


module.exports = router;