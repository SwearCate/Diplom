const express = require('express');

const mongoose = require('mongoose');

const Employee = mongoose.model('Employee');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("employee/addOrEdit",{
        viewTitle:"Введите сотрудника"
    })
})

router.post("/",(req,res) => {
    if(req.body._id == "")
    {
    insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
})

function insertRecord(req,res)
{
   var employee = new Employee();

   employee.fullName = req.body.fullName;

   employee.email = req.body.email;

   employee.location = req.body.location;

   employee.mobile = req.body.mobile;

   employee.save((err,doc) => {
       if(!err){
        res.redirect('employee/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("employee/addOrEdit",{
                  viewTitle:"Введите сотрудника",
                  employee:req.body
              })
          }

          console.log("Ошибка при записи" + err);
       }
   })
}

function updateRecord(req,res)
{
    Employee.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('employee/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("employee/addOrEdit",{
                    viewTitle:'Введите сотрудника',
                    employee:req.body
                });
            }
            else{
                console.log("Ошибка при записи" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Employee.find((err,docs) => {
        if(!err) {
            res.render("employee/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Employee.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("employee/addOrEdit",{
                viewTitle: "Обновление информации",
                employee: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Employee.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log("Ошибка при удалении" + err);
        }
    })
})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
        case 'fullName':
              body['fullNameError'] = err.errors[field].message;
              break;
        
        case 'email':
              body['emailError'] = err.errors[field].message;
              break;

        default:
           break;
        }
    }
}

module.exports = router;