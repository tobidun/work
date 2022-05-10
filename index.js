const express = require("express");
const bodyParser = require("body-parser");
const app = new express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const newPostController = require("./controllers/newPost");
const posts = require("./controllers/posts");
const about = require("./controllers/about");
const contact = require("./controllers/contact");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const validateMiddleware = require("./middleware/validationMiddleware");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const expressSession = require("express-session");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const logoutController = require("./controllers/logout");
// const flash = require("connect-flash");

mongoose.connect("mongodb+srv://tobi:brighty5@data.0os23.mongodb.net/test", {
  useNewUrlParser: true,
}),
  app.use(fileUpload());
// app.use("/posts/store", validateMiddleware);
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
app.listen(port, () => {
  console.log("App listening...");
});

app.use(
  expressSession({
    secret: "keyboard cat",
  })
);

// app.use(flash());

global.loggedIn = null;
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

app.get("/posts/new", authMiddleware, newPostController);
app.post("/posts/store", authMiddleware, storePostController);
app.get("/posts", posts);
app.get("/about", about);
app.get("/contact", contact);

app.get("/", homeController);
app.get("/post/:id", getPostController);

app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController
);
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController
);
app.get("/auth/logout", logoutController);
app.use((req, res) => res.render("notfound"));
