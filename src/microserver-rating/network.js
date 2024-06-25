const { Router } = require("express");

const router = Router();
const { rating, getRating, yetRating } =require("../controllers/usersController")


router.get('/', (req, res) => {
    res.send('microservicio rating funcionando bien');
});

router.post('/rating',rating);
router.get('/getRating/:id',getRating);
router.post('/yetrating',yetRating);





module.exports = router;