const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

let Notes = ["Buy Food","Go Home ", "Preapre food ", "Enjoy Food"];
workItems = [];

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req, res) => {

    let day = date.getDay();
    res.render("list", { listTitle: day, newNotes: Notes })
})

app.post("/", (req,res) => {

    let item = req.body.note;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
    Notes.push(item);
    res.redirect("/")
    }
})

app.get("/work", (req, res) => {
    res.render("list",{ listTitle: "Work List", newNotes: workItems })
})

app.get("/about", (req, res) => {
    res.render("about")
})


app.listen(3000)