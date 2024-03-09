var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const webrtc = require("wrtc");

const TeacherAccount = require('./models/teacheraccount');
const StudentAccount = require("./models/studentaccount");
const Lang_class = require('./models/lang_class');
const Doubt = require('./models/doubt');

const {name} = require("ejs");
const app = express();

let senderStream;

//loggedin = 0 (not logged), 1 (student), 2(teacher)
global.loggedin = 0;
global.logininfo = new Object;
global.currentuseremail = new String;
global.has_teacher = null;
global.temp2 = [];

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
      "students" : null,
      "question" : null,

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

  StudentAccount.find({"email" : email,"password" : password})
      .then(result => {
        if(result.length==0) {
          res.redirect("404");
        }
        else {
        loggedin = 1;
        global.logininfo = result;
        currentuseremail = result[0].email;
        has_teacher = result[0].teachers;
        console.log(currentuseremail);

        res.redirect('/homepage_student');
        console.log(result[0]);
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
        logininfo = result;
        currentuseremail = result[0].email;
        res.redirect('/homepage_teacher');
        }
      })
      .catch(err => {
        console.log(err);
      });
});

app.post("/question_submit_student",(req,res)=>{
  var mydoubt = req.body.mydoubt;
  var to = req.body.to;
  var from = currentuseremail;
  const doubt = new Doubt ({
    "mydoubt": mydoubt,
    "from" : from,
    "to": to,
    "answer": null,
  })
  doubt.save();
  res.redirect("successfully_sent.html");
});

app.post("/question_submit_teacher",(req,res)=>{
  var mydoubt = req.body.mydoubt;
  var to = req.body.to;
  var from = currentuseremail;
  const doubt = new Doubt ({
    "mydoubt": mydoubt,
    "from" : from,
    "to": to,
    "answer": null,
  })
  doubt.save();
  
});

app.post("/submit_answer",(req,res)=>{
  console.log("Called");
  var question = req.body.question;
  var myanswer = req.body.answer;

  Doubt.updateOne({mydoubt : question}, {$set: { answer : myanswer }},)
  .then(result => {
    res.render("answer_submitted");
  })
  .catch(err => {
    console.log(err);
    res.render("404");
  });
});

app.post("/search_teacher",(req,res)=> {
  var lang = req.body.language;
  var quali = req.body.qualification;
  var sched = req.body.schedule;
  
  TeacherAccount.find( { $and: [ { language : lang }, {qualification : quali}, {schedule : sched}, ] } )
  .then(result => {
    console.log(result);
    res.render('search_teacher',{myData : result,});
  })
  .catch(err => {
    console.log(err);
  });

});

app.post("/regis_teacher_stu",(req,res)=> {
  if(has_teacher) {
    res.render('already_has_teacher');
  }
  else {
  console.log("Debuggin!");
  var teacher_email = req.body.email;
  console.log(teacher_email);
  TeacherAccount.findOne({email : teacher_email})
  .then(result => {
    console.debug(result)
    StudentAccount.updateOne( { email: currentuseremail }, { $set: { teachers : result } } ) 
    console.log("Hey 2")
      res.redirect('regis_teacher_success.html');
    })
  }
});



app.post("/consumer", async ({ body }, res) => {
  const peer = new webrtc.RTCPeerConnection({
      iceServers: [
          {
              urls: "stun:stun.stunprotocol.org"
          }
      ]
  });
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
      sdp: peer.localDescription
  }

  res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
  const peer = new webrtc.RTCPeerConnection({
      iceServers: [
          {
              urls: "stun:stun.stunprotocol.org"
          }
      ]
  });
  peer.ontrack = (e) => handleTrackEvent(e, peer);
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
      sdp: peer.localDescription
  }

  res.json(payload);
});

function handleTrackEvent(e, peer) {
  senderStream = e.streams[0];
};

app.get("/",(req,res)=>{
  if(loggedin==1) {
    res.redirect('/homepage_student');
  }  
  else if(loggedin==2) {
    res.redirect('/homepage_teacher');
  }
  else {
    res.render('index');
  }

});
app.get("/login_student",(req,res)=> {
  if(loggedin==1) {
    res.redirect('/homepage_student')

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
    res.redirect('/homepage_teacher')

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
  logininfo = null;
  currentuseremail = null;

});
app.get('/homepage',(req,res)=> {
  if(loggedin==1) {
    res.redirect("/homepage_student");
  }
  else if(loggedin==2) {
    res.redirect("homepage_teacher");
  }
  else {
    res.redirect("/");
  }

});
app.get("/homepage_student",(req,res)=> {
  if(loggedin==1) {
    res.render('homepage_student',{myData : logininfo});
  }
  else if (loggedin==2) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/login_student');
  }
});
app.get("/homepage_teacher",(req,res)=> {
  if(loggedin==2) {
    res.render('homepage_teacher',{myData : logininfo});
  }
  else if (loggedin==1) {
    res.render('already_student');
  }
  else {
    res.redirect('/login_teacher');
  }
});
app.get("/question_submit_teacher",(req,res)=> {
  if(loggedin==2) {
    res.render('question_submit_teacher',{myData : logininfo});
  }
  else if (loggedin==1) {
    res.render('already_student');
  }
  else {
    res.redirect('/login_teacher');
  }
});
app.get("/question_submit_student",(req,res)=> {
  if(loggedin==1) {
    res.render('question_submit_student',{myData : logininfo});
  }
  else if (loggedin==2) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/login_student');
  }
});

app.get("/seequestions_student",(req,res)=> {
  if(loggedin==1) {
    console.log(currentuseremail);
    Doubt.find( { $or: [ { to: "public" }, { to : currentuseremail } ] } )

      .then(result => {
        res.render('student_seequestions',{myData : result,});
      })
      .catch(err => {
        console.log(err);
      });

  }

  else if (loggedin==2) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/login_student');
  }
});

app.get("/seequestions_teacher",(req,res)=> {
  if(loggedin==2) {
    Doubt.find( { $or: [ { to: "public" }, { to : currentuseremail }, {from : currentuseremail} ] } )
      .then(result => {
        res.render('teacher_seequestions',{myData : result,});
      })
      .catch(err => {
        console.log(err);
      });

    
  }
  else if (loggedin==1) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/login_student');
  }
});

app.get("/search_teacher",(req,res)=> {
  if(loggedin==1) {
    TeacherAccount.find({})
      .then(result => {
        res.render('search_teacher',{myData : result,});
      })
      .catch(err => {
        console.log(err);
      });
  }
  else if (loggedin==2) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/login_student');
  }
});

app.get("/seequestions",(req,res)=> {
  if(loggedin==1) {
    res.redirect('/seequestions_student');
  }
  else if (loggedin==2) {
    res.redirect('/seequestions_teacher');
  }
  else {
    res.redirect('/');
  }
});
app.get('/my_teachers', (req, res) => {
  StudentAccount.find({email : currentuseremail})
    .then(result => {
      res.render('my_teachers', { myData: result.teachers,});
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/interns', (req, res) => {
  Intern.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('interns', { myData: result,});
    })
    .catch(err => {
      console.log(err);
    });
});
app.get('/help', (req, res) => {
  res.render('help');
});
app.get('/register_to_teacher', (req, res) => {
  if(loggedin==1) {
    res.render('register_to_teacher');
  }
  else if (loggedin==2) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/');
  }
});
app.get('/broadcast',(req,res) => {
  res.render('host');
});
app.get('/consumer',(req,res) => {
  res.render('viewer');
});
app.get('/join_class',(req,res) => {
  res.redirect('./views/viewer.html');
});
app.get('/host_class',(req,res) => {
  res.render('host');
});
app.get('/my_teacher', (req,res) => {
  if(loggedin==1) {
    res.render('my_teachers',{myData : has_teacher});
  }
  else if (loggedin==2) {
    res.render('already_teacher');
  }
  else {
    res.redirect('/');
  }
})
app.use((req,res)=> {
    res.render('404');
});

