const { Router } = require("express");

const router = Router();
const { follow, unfollow, followed, follower, checkFollowingStatus } =require("../controllers/usersController")


router.get('/', (req, res) => {
    res.send('microservicio follow funcionando bien');
});

router.post('/followUser',follow)
router.post('/unFollowUser',unfollow)
router.get('/followed/:id',followed);
router.get('/follower/:id',follower);
router.post('/checkfollowing',checkFollowingStatus);




module.exports = router;