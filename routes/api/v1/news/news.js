const express = require("express");
const router = express.Router();
const newsController = require("../../../../controllers/university/news");

router.post("/create", newsController.createNews);
router.get("/all-news", newsController.getAllNews);

module.exports = router;
