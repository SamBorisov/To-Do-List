const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname + "/date.js");
const _ = require("lodash");


//basic setup
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/TodoDB", { useNewUrlParser: true })

//Mongo schemas and others
const itemSchema = {
    name: String
}

const Item = mongoose.model("Item", itemSchema);

const todo1 = new Item({
     name: "Wellcome!",
 })
const todo2 = new Item({
    name: "Click the + button to add new task",
})
const todo3 = new Item({
    name: "<-- hit this to delete",
})

const defaultItems = [todo1, todo2, todo3];

// for ./custom schema
const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


// app gets and posts
app.get("/", (req, res) => {

    Item.find((err, items) => { 

        if (items.length === 0) {

            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newNotes: items })
        }
    });

    
})

app.post("/", (req,res) => {

    const itemName = req.body.note;
    const listName = req.body.list;

    const item = new Item({
        name: itemName,
    })
    if ( listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, result) => {
            result.items.push(item);
            result.save();          
        })
        res.redirect("/"+ listName);
    }

})


app.post("/delete", (req,res) => {


    const checkedItem = req.body.checkDel;
    const listItem = req.body.listName;

    if(listItem === "Today") {

        Item.deleteOne({_id: checkedItem}, (err) => { 
        console.log("Single Item Deleted from root")});
        
        res.redirect("/");
        
    } else {

        List.findOneAndUpdate( {name:listItem} , {$pull: {items:{_id:checkedItem }}}, (err, result) => { 
            if (err){
                console.log(err)
            } else {
                console.log("Single Item Deleted")
                res.redirect("/" + listItem);
            }

    });   
    }

})


// other
app.get("/:custom", (req, res) => {

    const customList = _.capitalize(req.params.custom);

    List.findOne({name: customList}, (err, result) => {
        if (!err) {
        if (!result) {
            console.log("Not Found")
            const list = new List({
                name: customList,
                items: defaultItems
            })
            list.save();
            res.redirect("/"+ customList);
        } else {
            console.log("Found")
            res.render("list", { listTitle: result.name, newNotes: result.items })

        }
    }
    })



})



app.get("/about", (req, res) => {
    res.render("about")
})







// listening on port 3000
app.listen(3000)