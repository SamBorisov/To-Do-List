
function getDate() {

    let today = new Date();
    let options = { weekday: 'long', day: 'numeric', month: 'long'};
    let day = today.toLocaleDateString("en-US", options);

    return day;
}

module.exports.getDate = getDate;


exports.getDay =  function () {

    let today = new Date();
    let options = { weekday: 'long'};
    return today.toLocaleDateString("en-US", options);
}


// Item.deleteMany({}, (err) => { 
//     if (err){
//     console.log(err)
//     } else {
//     console.log("Items Deleted")}});