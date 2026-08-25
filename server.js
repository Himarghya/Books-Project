import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

env.config();

const app = express();
const port = 3000;
const SaltingRounds = 10;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret : process.env.Session_Secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user : process.env.DataBase_User,
    host : process.env.DataBase_host,
    password : process.env.DataBase_password,
    database : process.env.DataBase_data,
    port : process.env.DataBase_port
})
db.connect();
async function DatabaseBooks(){
    try{
        const response = await db.query("SELECT * FROM books");
        return response.rows
    }catch(error){
        console.error("Error message is :" , error.message);
        throw error;
    }
}

app.get("/Home", async (req, res) => {
    if(req.isAuthenticated()){
        const books = await DatabaseBooks();
        res.render("index.ejs", { books });
    }else{
        res.redirect("/login");
    }
    
});

app.get("/",async (req, res) => {
    res.render("landing.ejs");
});
//---------------------Registering User-------------------------------------
app.get("/register", (req, res) => {
    res.render("register.ejs");
});
app.post("/register" , async (req ,res)=>{
    const UserName = req.body["username"];
    const FullName = req.body["fullName"]
    const Email = req.body["email"];
    const Password = req.body["password"];
        bcrypt.hash(Password , SaltingRounds , async (err, hash)=>{
            if(err){
                console.error("Error message is : " , err.message);
            }else{
                try{
                    const result = await db.query(`SELECT email FROM users WHERE email=LOWER($1)`,[Email]);
                    if(result.rows.length > 0){
                        res.send(`<script> 
                            alert("User is already registered");
                            window.location.href="/login";
                            </script>`);
                    }else{
                        const result = await db.query(`INSERT INTO users (email , password , fullname , username) VALUES (LOWER($1) , $2 , $3 , $4) RETURNING *`,
                        [Email, hash ,FullName,UserName]);
                        const user = result.rows[0];
                        req.login(user , (err)=>{
                            console.log(err);
                            res.redirect("/Home");
                        })
                    }
                }catch(error){
                    console.error("Error message is :" , error.message);
                    res.status(404).send(error.message);
                }
            }
        })
})
//------------------------------------Loging In user------------------------------
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login" , passport.authenticate("local",{
    successRedirect : "/Home",
    failureRedirect : "/login"
}) )

passport.use(new Strategy({
            usernameField: "cardNumber"
        }, async function verify(cardNumber ,password , cb ){
     try{
        const response = await db.query(`SELECT email,password FROM users WHERE email=LOWER($1)`,[cardNumber])
        if(response.rows.length === 0){
            return cb(null , false , {message : "User is not registered"});
        }else{
            const user = response.rows[0];
            bcrypt.compare(password, user.password, async(err, result)=>{
                if(err){
                    return cb(err);
                }else{
                    if(result){
                        // res.redirect("/Home");
                        return cb(null, user);
                    }else{
                        return cb(null, false , {message : "Incorrect password"});
                    }
                }
            } )
        }
    }catch(error){
        return cb(error);
    }

}))
//---------------------------------------------------------------
app.get("/post", async (req, res) => {
  res.render("post.ejs");
});
//For posting out the new books data 
app.post("/books" , async (req , res) =>{
    try{
        const title = req.body["title"];
        const author = req.body["author"];
        const rating = req.body["rating"];
        const date = req.body["date"];
        const isbn = req.body["isbn"];
        const Note = req.body["note"];
        try{
           await db.query(`INSERT INTO books (title , author , isbn , rating , date , note) 
           VALUES ($1, $2, $3, $4, $5, $6)`,[title, author, isbn, rating, date, Note]);
        }catch(error){
           console.error("Error message is :" , error.message);
           res.status(404).send(error.message);
        }
    }catch(error){
        console.error(error.message);
        res.status(404).send(error.message);
    }
    res.redirect("/Home");
})

passport.serializeUser((user, cb)=>{
    cb(null , user);
})
passport.deserializeUser((user, cb)=>{
    cb(null , user);
})

app.listen(port, () => {
  console.log(`Listening at port ${port} , http://localhost:${port}`);
});