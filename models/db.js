const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/my_app"

mongoose.connect(url,{useNewUrlParser:true},(err) => {
    if(!err){ console.log("MongoDB Connection Succeeded");}
    else{
        console.log("Ошибка " + err);
    } 
})

require('./employee.model');