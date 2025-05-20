require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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



userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
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
  const { username, password } = req.body;
  const newUser = new User({
    email: username,
    password: password,
  });
  try {
    await newUser.save();
    console.log("User registered successfully");
    res.render("secrets.ejs");
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async(req, res) => {
  
  const { username, password } = req.body;
  const user = await User.findOne({ email: username });
  if (user) {
    if (user.password == password) {
    res.render("secrets.ejs");
    }
  } else {
    console.log("Invalid credentials");
    return res.render("login.ejs", { message: "Invalid username or password" });
  }
}
);
app.get("/logout", (req, res) => {
  // Handle logout logic here
  res.redirect("/");
}
);





app.listen(3000, () => {
  console.log("Server started on port 3000");
});