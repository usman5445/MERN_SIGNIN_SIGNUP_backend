require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//middlware
app.use(express.json());
app.use(cors());
//routes
const userRouter = require("./Routes/userRoutes");
app.use("/api/user", userRouter);

app.get("/",(req,res)=>{
  res.send("backend working properly.")
})

//mongoose configuration and server configuration
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(
        `connected to database & server started on port ${
          process.env.PORT || 4000
        }`
      );
    });
  })
  .catch((err) => {
    //console.log(err);
  });
