const { Router } = require("express");
const pool = require("./db");
const router = Router();
const {
    getUsers,
} =require("../controllers/usersController")

router.get('/user',getUsers);
router.get('/', (req, res) => {
    res.send('microservicio funcionando bien');
});



module.exports = router;