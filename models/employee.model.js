const mongoose = require('mongoose');
const validator = require("email-validator");

var employeeSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: 'Заполните поле'
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    location:{
        type:String
    }
})

// валидация на уровне сервера

employeeSchema.path('email').validate((val) => {
    return validator.validate(val);
},'Неверный e-mail');

mongoose.model('Employee',employeeSchema);
module.exports = mongoose.model('Employee', employeeSchema)
