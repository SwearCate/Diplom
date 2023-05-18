require('./models/db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const employeeController = require('./controller/employeeController');

var app = express();

app.use(express.static('client'));
app.use(express.static('files'));
app.use('/static', express.static('client'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/static', express.static('app'));
app.use('/static', express.static(__dirname + '/app'));

const cors = require('cors')
const cookieSession = require('cookie-session')

app.use(express.urlencoded({extended: true}));
app.use(
    cookieSession({
        name: "SwearCat-session",
        secret: "SECRETWORD",
        httpOnly: true
    })
);

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.set('views',path.join(__dirname,'/views/'))

app.engine('hbs',expressHandlebars({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/'
}))

// РОУТИНГ

require('./app/routers/auth.routes')(app);
require('./app/routers/user.routes')(app);
app.get("/", (req, res) =>{
    res.json({message: "Добро пожаловать"});
});

app.set('view engine','hbs');

app.listen(5000,() => {
    console.log("Сервер запущен порт 5000");
})

app.use('/employee',employeeController);