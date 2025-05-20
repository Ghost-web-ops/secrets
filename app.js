import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "clientdata",
  password: "omaryasser",
  port: 5432,
});

db.connect();

async function data() {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    return result.rows;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());

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
    const username = req.body.username;
    const password = req.body.password; 
    const result = await data();
    try{
    if (result.length === 0) {
        console.log("No users found");
        return res.redirect("/register");
    }
   
    const user = result.find(user => user.username === username && user.password === password);
    if (user) {
        
        console.log("Invalid credentials");
        return res.render("secrets.ejs");
    }else{
        console.log(username, password);
        await db.query(
        "INSERT INTO users (username, password) VALUES ($1, $2)",
        [username, password]
        );
        res.redirect("/login");
    }
    
    }catch(err){
        console.log(err);
        res.redirect("/register");
    }
}
);
app.post("/login", async(req, res) => {
    const { username, password } = req.body;
    const result = await data();
    console.log("Database result:", result);
    console.log("Received:", req.body);
    if (result.length === 0) {
        console.log("No users found");
        return res.redirect("/register");
    }
    const user = result.find(user => user.username === username && user.password === password);
    if (!user) {
        console.log("Invalid credentials");
        return res.render("login.ejs", { message: "Invalid username or password" });
    }else{
        res.render("secrets.ejs");
    }
    console.log("User authenticated:", user);
    
    // Here you would typically check the user's credentials against your database
    
}
);
app.get("/logout", (req, res) => {
    // Handle logout logic here
    res.redirect("/");
}
);









app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
