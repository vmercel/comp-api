const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const { ensureAuthenticated, ensureAuthorized } = require("../middleware/auth-middleware");
const { validationRules, validate } = require("../validations/post-validator");
const { addOne, removeOne, updateOne, getAll, getOne, getOneBySlug, getTopposts } = require("../controllers/posts-controller");
const PATH = "../public/";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, PATH));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname);
        req.body.imageUrl = fileName;
        cb(null, fileName);
    },
});

const upload = multer({
    storage: storage,
});

router.get("/posts", async(req, res) => {
    // #swagger.tags = ['Posts']

    await getAll(req, res);
});

router.get("/posts/top", async(req, res) => {
    // #swagger.tags = ['Posts']

    await getTopposts(req, res);
});

router.post("/posts", ensureAuthenticated, ensureAuthorized(["admin"]),
    upload.any("files")
);

router.post("/posts", ensureAuthenticated, ensureAuthorized(["admin"]), validationRules(), validate, async(req, res) => {
    /*  #swagger.tags = ['Posts']
        #swagger.consumes = ['multipart/form-data']
        #swagger.security = [{
        "Authorization": []
        }]
        #swagger.parameters['file'] = {
            in: 'formData',
            required: true,
            type: 'file'
        }
      
    	#swagger.parameters['category'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
      #swagger.parameters['title'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
      #swagger.parameters['body'] = {
            in: 'formData',
            required: true,
            type: 'string',
      } 
    
    */

    await addOne(req, res);
});

router.put("/posts/:id", ensureAuthenticated, ensureAuthorized(["admin"]), validationRules(), validate, async(req, res) => {
    /*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    	#swagger.parameters['obj'] = {
            in: 'body',
            required: true,
            schema: { $ref: "#/definitions/PostModel" }
    } */
    await updateOne(req, res);
});

router.get("/posts/:id", async(req, res) => {
    // #swagger.tags = ['Posts']  
    await getOne(req, res);
});

router.get("/posts/slug/:slug", async(req, res) => {
    // #swagger.tags = ['Posts']  
    await getOneBySlug(req, res);
});


router.delete("/posts/:id", ensureAuthenticated, ensureAuthorized(["admin"]), async(req, res) => {
    /*  #swagger.tags = ['Posts']
        #swagger.security = [{
        "Authorization": []
        }]
    */
    await removeOne(req, res);
});

module.exports = router;