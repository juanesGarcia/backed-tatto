const { Router } = require("express");

const router = Router();
const {
    logout,
    login,
    register
  
} =require("../controllers/usersController")


router.get('/', (req, res) => {
    res.send('microservicio auth funcionando bien');
});

router.get('/logout',logout);
router.post('/login',login);
router.post('/register',register);



module.exports = router;