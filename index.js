const app = require("./app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, function (err) {
  if (err) {
    console.log("error in setting up server", err);
    return;
  }
  console.log(`Sever is running up on port ${PORT} :) `);
});
