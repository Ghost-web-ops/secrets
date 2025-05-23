require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});





const User =new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
}
);
app.get("/login", (req, res) => {
  res.render("login.ejs");
}
);
app.get("/register", (req, res) => {
  res.render("register.ejs");
}
);
app.post("/register", async (req, res) => {

bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
  const { username, password } = req.body;
  const newUser = new User({
    email: username,
    password:hash,
  });
  try {
    await newUser.save();
    console.log("User registered successfully");
    res.render("secrets.ejs");
  } catch (err) {
    console.log(err);
  }
});
});

app.post("/login", async(req, res) => {
  
  const { username, password } = req.body;
  const user = await User.findOne({ email: username });
 
    bcrypt.compare(password, user.password, function(err, result) {
     
    if (result == true) {
    res.render("secrets.ejs");
    }
   else {
    console.log("Invalid credentials");
    return res.render("login.ejs", { message: "Invalid username or password" });
  }
  });
});
app.get("/logout", (req, res) => {
  // Handle logout logic here
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});