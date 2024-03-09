var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const TeacherAccount = require('./models/teacheraccount');
const StudentAccount = require("./models/studentaccount");
const {name} = require("ejs");
const app = express()
//loggedin = 0 (not logged), 1 (student), 2(teacher)
global.loggedin = 0;
app.set('view engine','ejs');

app.use(bodyParser.json())
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb+srv://admin:admin123@mycluster.h0cxfmp.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((result)=> {app.listen(3000); console.log("Listening on PORT 3000")})
.catch((err)=>console.log(err));

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))


app.post("/sign_up_student",(req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  var age = req.body.age;
  var email = req.body.email;
  var phno = req.body.phno;
  

    const student =new StudentAccount ({
      "username": username,
      "password" : password,
      "age": age,
      "email": email,
      "phno" : phno,
      "classes" : null,
    })

    
  StudentAccount.find({"email" : email})
  .then(result => {
    if(result.length==0) {
      student.save()
  .then(result => {
    return res.redirect('signup_acc_success.html');
  })
  .catch(err => {
    console.log(err);
  });

    }
    else {
      return res.redirect("acc_already_exists.html");
    }
  })
  .catch(err => {
    console.log(err);
    return res.redirect("acc_already_exists.html");
  });
  

  
});

app.post("/sign_up_teacher",(req,res)=>{
  var username = req.body.username;
  var password = req.body.password;
  var age = req.body.age;
  var email = req.body.email;
  var phno = req.body.phno;
  var qualification = req.body.qualification;
  var schedule = req.body.schedule;
  var price = req.body.price;
  var language = req.body.language;

    const teacher = new TeacherAccount ({
      "username": username,
      "password" : password,
      "age": age,
      "email": email,
      "phno" : phno,
      "qualification": qualification,
      "schedule" : schedule,
      "price": price,
      "language": language,
      "classes_taught": null,
    })

    
  TeacherAccount.find({"email" : email})
  .then(result => {
    if(result.length==0) {
      teacher.save()
  .then(result => {
    return res.redirect('signup_acc_success.html');
  })
  .catch(err => {
    console.log(err);
  });

    }
    else {
      return res.redirect("acc_already_exists.html");
    }
  })
  .catch(err => {
    console.log(err);
    return res.redirect("acc_already_exists.html");
  });

});

app.post("/login_student",(req,res)=>{
  var email = req.body.email;
  var password = req.body.password;

  StudentAccount.find({"username" : email,"password" : password})
      .then(result => {
        if(result.length==0) {
          res.redirect("404");
        }
        else {
        loggedin = 1;
        global.logininfo = result;
        res.render('homepage', { myData: result,});
        }
      })
    
      .catch(err => {
        console.log(err);
      });
});

app.post("/login_teacher",(req,res)=>{
  var email = req.body.email;
  var password = req.body.password;

  TeacherAccount.find({"email" : email,"password" : password})
      .then(result => {
        if(result.length==0) {
          res.redirect("404");
        }
        else {
        loggedin = 2;
        global.logininfo = result;
        res.render('homepage', { myData: result,});
        }
      })
      .catch(err => {
        console.log(err);
      });
});

app.get("/",(req,res)=>{
    res.render('index');
});
app.get("/login_student",(req,res)=> {
  if(loggedin==1) {
    res.render('homepage_student', {myData : logininfo})

  }
  else if(loggedin==2) {
    res.render('already_teacher',);

  }
  else {
  res.render("student_login");
  }
});
app.get("/login_teacher",(req,res)=> {
  if(loggedin==2) {
    res.render('homepage_teacher', {myData : logininfo})

  }
  else if(loggedin==1) {
    res.render('already_student',);
  }
  else {
  res.render("teacher_login");
  }
});
app.get("/signup_teacher",(req,res)=> {
  res.render("teacher_signup");
});
app.get("/signup_student",(req,res)=> {
  res.render("student_signup");
});
app.get("/logout",(req,res)=> {
  res.render("logout");
  loggedin = 0;
});

app.use((req,res)=> {
    res.render('404');
});

