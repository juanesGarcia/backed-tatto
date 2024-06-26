const { Router } = require("express");

const router = Router();
const { uploadImages, getImages, deleteImages, editarTitleImages } =require("../controllers/usersController")


router.get('/', (req, res) => {
    res.send('microservicio post funcionando bien');
});

router.post('/upload/:id',uploadImages);
router.get('/getimages/:id',getImages)
router.delete('/deleteimages/:postId', deleteImages);
router.put('/editar/:postId',editarTitleImages);


module.exports = router;