const News = require("../../models/universities/news.schema");

module.exports.createNews = async (req, res) => {
  console.log(req.body);
  const { about, description, createdBy, headline, address, title } = req.body;

  if (!about || !description || !createdBy || !address || !title) {
    let errorMessage =
      (!about && "about") ||
      (!description && "description") ||
      (!createdBy && "createdBy") ||
      (!headline && "headline") ||
      (!title && "title") ||
      (!address && "address");
    return res.status(404).json({
      success: false,
      data: { message: `Please enter the ${errorMessage}` },
    });
  }
  try {
    await News.create(req.body, (err, news) => {
      if (err) console.log(err.message);
      if (news) {
        console.log(news);
        return res.status(201).json({
          success: true,
          data: { message: "News created successfully" },
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: { message: "internal server error", error: error.message },
    });
  }
};

module.exports.getAllNews = async (req, res) => {
  try {
    let allNews = await News.find({});
    return res
      .status(200)
      .json({ success: true, data: { message: "data fetched", allNews } });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: { message: "Internal server error", error: error.message },
    });
  }
};
