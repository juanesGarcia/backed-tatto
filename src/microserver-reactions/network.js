const { Router } = require("express");

const router = Router();
const { checkreactions, unreaction, getReaction, reactions } =require("../controllers/usersController")


router.get('/', (req, res) => {
    res.send('mtcroservicio reyctions funcionando bien pross GONOREEA hpt');
});

router.post('/reaction',reactions);
router.post('/checkreactions',checkreactions);
router.post('/unreaction',unreaction);
router.get('/getreactions/:id',getReaction);



module.exports = router;