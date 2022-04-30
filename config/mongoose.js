const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function (err) {
  if (err) console.log(err);
  console.log("Database connected to port  5001 :)");
});
