/* ========================

    	*REGULAR ROUTES*

==========================*/
require('dotenv').config();


var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var uniqid = require('uniqid');

// MODELS
var Token = require('../models/Token');
var User = require('../models/User');
var Student = require('../models/StudentRecord');
var Teacher = require('../models/TeacherRecord');
var Semester = require('../models/Semester');
var Attendance = require('../models/Attendance');
// var SchoolYear = require('../models/SchoolYear');
var Strand = require('../models/Strand');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'noreply.shs.cct@gmail.com',
    pass: '(N2V<"uPj=xTN7YV'
  }
})

const generateCode = () => `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`; 


/* ________________________________
|
|   Generated code values
|__________________________________
| 
|   By default, every code inside of
|   this hashmap is not verified.
|
| 
|   <school_id | username>: <code> 
|
*/
const generatedCode = {};



const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[ 1 ];

  if( !token ) return res.sendStatus( 401 );

  jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if( err ) return res.sendStatus( 401 );

    req.user = user;
    next();
  });
}


router.get('/verify-me', authentication, async (req, res, next) => {
  // If a request came here then the user is authorized
  return res.json({ user: req.user, message: `Welcome ${ req.user.username }`});
});


router.delete('/sign-out/token/:token', authentication, async ( req, res ) => {
  Token.deleteOne({ code: req.params.token }, (err) => {
    if( err ) return res.sendStatus( 500 );

    return res.sendStatus( 200 );
  });
});


router.get('/check-semester', async ( req, res ) => {
  Semester.findOne({}, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    console.log( doc );
    if( doc ){
      return res.sendStatus( 200 );
    }
    else{
      Semester.create({ activeSemester: 1 }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.sendStatus( 200 );
      });
    }
  });
});


router.get('/user-forgot-password/get-code/id/:id', async ( req, res ) => {
  // email: noreply.shs.cct@gmail.com
  // password: (N2V<"uPj=xTN7YV
  const { id } = req.params;

  if( !id ) return res.sendStatus( 404 );

  const generateMailOptions = otherEmail => {
    const code = generateCode();

    generatedCode[ id ] = code;

    return {
      from: 'noreply.shs.cct@gmail.com',
      to: otherEmail,
      subject: 'Change password code',
      text: `Your code is: ${code}`
    }
  }

  Student.findOne({ studentNo: id }, async ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      const mailOptions = generateMailOptions( doc.email );

      try{
        await transporter.sendMail( mailOptions );
        return res.status( 200 ).json({ message: 'A confirmation code has been sent to your email address' });
      }
      catch( err ){
        console.log( err );
        return res.sendStatus( 500 );
      }
    }
    else{
      Teacher.findOne({ employeeNo: id }, async ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          const mailOptions = generateMailOptions( doc.email );

          try{
            await transporter.sendMail( mailOptions );
            return res.status( 200 ).json({ message: 'A confirmation code has been sent to your email address' });
          }
          catch( err ){
            console.log( err );
            return res.sendStatus( 500 );
          }
        }
        else{
          return res.sendStatus( 404 );
        }
      });
    }
  });
});


router.post('/user-forgot-password/code-verification/id/:id', async( req, res ) => {
  const { id } = req.params;
  const { code } = req.body;

  if( !id || !code ) return res.sendStatus( 404 );

  if( generatedCode[ id ] && generatedCode[ id ] === code ){
    delete generatedCode[ id ];

    return res.sendStatus( 200 );
  }
  else{
    return res
    .status( 406 )
    .json({
      message: 'Incorrect code'
    });
  }
});

router.post('/change-user-password-from-forgot-password/id/:id', async( req, res ) => {
  const { id } = req.params;
  const { newPass } = req.body;

  if( !id || !newPass ) return res.sendStatus( 404 );

  User.findOne({ username: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      doc.password = newPass;

      doc.save( err => {
        if( err ) return res.sendStatus( 500 );

        return res.sendStatus( 200 );
      });
    }
  });
});

router.put('/change-user-password/id/:id', authentication, async ( req, res ) => {
  const { id } = req.params;
  const { currPass, newPass } = req.body;

  if( !id || !currPass || !newPass ) return res.sendStatus( 404 );

  User.findOne({ username: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      if( doc.password === currPass ){
        doc.password = newPass;

        doc.save( err => {
          if( err ) return res.sendStatus( 500 );

          return res.sendStatus( 200 );
        });
      }
      else{
        return res.status( 406 ).json({ message: 'Current password is incorrect!' });
      }
    }
  });
});

router.put('/user-status-switch/status/:status/id/:id', authentication, async ( req, res ) => {
  const { id, status } = req.params;

  Student.findOne({ _id: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      if( doc.state === 'verified' ){
        doc.status = status;

        doc.save( err => {
          if( err ) return res.sendStatus( 500 );

          return res.sendStatus( 200 );
        });
      }
      else{
        return res
          .status( 405 )
          .json({
            message: 'Account has not been verified yet'
          });
      }
    }
    else{
      Teacher.findOne({ _id: id }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          if( doc.state === 'verified' ){
            doc.status = status;

            doc.save( err => {
              if( err ) return res.sendStatus( 500 );

              return res.sendStatus( 200 );
            });
          }
          else{
            return res
              .status( 405 )
              .json({
                message: 'Account has not been verified yet'
              });
          }
        }
        else{
          return res.sendStatus( 404 );
        }
      });
    }
  });
});

router.put('/activate/semester/:semesterNumber', authentication, async ( req, res ) => {
  const { semesterNumber } = req.params;

  if( !semesterNumber ) return req.sendStatus( 406 );

  Semester.find({}, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );
  
    if( doc.length ){
      doc[ 0 ].activeSemester = semesterNumber;

      doc[ 0 ].save( err => {
        if( err ) return res.sendStatus( 500 );

        return res.sendStatus( 200 );
      });
    }   
    else{
      return res.sendStatus( 406 );
    }
  });
});

router.get('/get-single-user/type/:type/id/:id', authentication, async ( req, res ) => {
  const { type, id } = req.params;

  if( !type || !id ) return res.sendStatus( 404 );

  switch( type ){
    case 'student':
      Student.findOne({ studentNo: id }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });
      break;

    case 'teacher':
      Teacher.findOne({ employeeNo: id }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });   
      break;   

    default:
      return res.sendStatus( 200 );  
  }
});

// router.get('/get-teachers/strand/:strand/section/:section', async ( req, res ) => {
  
// });

router.get('/get-users/type/:type', async ( req, res ) => {
  const { type } = req.params;

  switch( type ){
    case 'student':
      Student.find({}).sort({ firstName: 1 }).exec(( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });
      break;

    case 'teacher':
      Teacher.find({}).sort({ firstName: 1 }).exec(( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });   
      break;   

    default:
      return res.sendStatus( 200 );  
  }
});


router.get('/get-subject-from-strand/strands/:strands', async ( req, res ) => {
  if( !req.params.strands ) return res.sendStatus( 406 );

  const strands = req.params.strands.split(',');

  Strand.find().where('name').in( strands ).exec(( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc.length ){
      return res.json(doc.reduce(( prev, accum ) => {
        prev = [ ...prev, ...accum.subjects ];
        return prev;    
      }, []));
    }
    else{
      return res.sendStatus( 200 );
    }
  }); 
});


router.get('/get-items/type/:type', async ( req, res ) => {
  const { type } = req.params;

  switch( type ){
    case 'semester':
      Semester.findOne({}, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ activeSemester: doc.activeSemester });
      });   
      break;

    // case 'school-year':
    //   SchoolYear.find({}).sort({ from: 1 }).exec(( err, doc ) => {
    //     if( err ) return res.sendStatus( 500 );

    //     return res.json( doc );
    //   });   
    //   break;

    case 'strand':
      Strand.find().sort({ name: 1 }).exec(( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });      
      break;

    default:
      return res.sendStatus( 200 );
  }
});


router.post('/edit/type/:type/id/:id', authentication, async ( req, res ) => {
  const { type, id } = req.params;

  if( !req.body || !id || !type ) return res.sendStatus( 406 );

  switch( type ){
    case 'strand':
      Strand.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Strand' });
      });      
      break;

    case 'student':
      Student.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Student' });
      });
      break;

    case 'teacher':
      Teacher.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Teacher' });
      });
      break;

    // case 'school-year':
    //   const { from, to } = req.body;
    //   try{
    //     const existingSy = await SchoolYear.find({}).$where(`(this.from === ${from} || this.to === ${to})`);

    //     if( existingSy.length && existingSy[ 0 ]._id.toString() !== id ){
    //       return res.status( 406 ).json({ message: 'School-year already exists!' });
    //     }

    //     SchoolYear.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
    //       if( err ) return res.sendStatus( 500 );

    //       return res.json({ message: 'Successfully edited this school-year' });
    //     });
    //   }
    //   catch( err ){
    //     console.log( err );
    //     return res.sendStatus( 500 );        
    //   }
    //   break;

    default:
      return res.sendStatus( 404 );
  }
});

router.delete('/delete/type/:type/id/:id', authentication, async ( req, res ) => {
  const { type, id } = req.params;

  if( !req.body ) return res.sendStatus( 406 );

  switch( type ){
    case 'section':
      Strand.findOneAndDelete({ _id: id }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully deleted' });
      });
      break;

    case 'strand':
      Strand.findOneAndDelete({ _id: id }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully deleted' });
      });
      break;

    case 'student':
      Student.findOneAndDelete({ _id: id }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully deleted' });
      });
      break;

    case 'teacher':
      Teacher.findOneAndDelete({ _id: id }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully deleted' });
      });
      break;

    // case 'school-year':    
    //   SchoolYear.findOneAndDelete({ _id: id }, err => {
    //     if( err ) return res.sendStatus( 500 );

    //     return res.json({ message: 'Successfully deleted' });
    //   });
       
    //   break;

    default:
      return res.sendStatus( 404 );
  }
});

router.post('/add/type/:type', authentication, async ( req, res ) => {
  const { type } = req.params;

  if( !req.body ) return res.sendStatus( 406 );

  switch( type ){
    case 'strand':
      Strand.create({ name: req.body.name.toUpperCase(), subjects: req.body.subjects }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Strand' });
      });      
      break;

    case 'section':
      const { name, parent } = req.body;

      if( !name || !parent ) return res.status( 404 ).json({ message: 'Please fill up all fields' });

      Strand.findOne({ name: parent }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          doc.sections.push( name.toUpperCase() );

          doc.save( err => {
            if( err ) return res.sendStatus( 500 );

            return res.json({ message: 'Successfully added a new Strand' });
          });      
        }
        else{
          return res.status( 404 ).json({ message: 'Successfully added a new Strand' });
        }
      });      
      break;

    case 'student':
      Student.create({ ...req.body }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Student' });
      });
      break;

    case 'teacher':
      Teacher.create({ ...req.body }, err => {
        if( err ){
          console.log( err );
          return res.sendStatus( 500 );
        }

        return res.json({ message: 'Successfully added a new Teacher' });
      });
      break;

    // case 'school-year':
    //   const { from, to } = req.body;
    //   try{
    //     const existingSy = await SchoolYear.find({}).$where(`this.from === ${from} || this.to === ${to}`);

    //     if( existingSy.length ){
    //       return res.status( 406 ).json({ message: 'School-year already exists!' });
    //     }
    //     else{
    //       SchoolYear.create({ ...req.body }, err => {
    //         if( err ) return res.sendStatus( 500 );

    //         return res.json({ message: 'Successfully added a new school-year' });
    //       });
    //     }
    //   }
    //   catch( err ){
    //     console.log( err );
    //     return res.sendStatus( 500 );        
    //   }
    //   break;

    default:
      return res.sendStatus( 404 );
  }
});




/*-------------------------------
          Attendancing
-------------------------------*/
router.get('/students-attendance/id/:id', async ( req, res, next ) => {
  const { id } = req.params;

  Attendance.findOne({ studentNo: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      return res.json( doc );
    }
    else{
      return res.sendStatus( 404 );
    }
  });
});

router.put('/student/update-attendance/id/:id/teacherId/:teacherId', async ( req, res, next ) => {
  const { id, teacherId } = req.params;

  const graceTime = 30; // 30minute grace time or period

  const getRemark = async ( time, teachers ) => {
    for( let teacher of teachers ){
      const teacherDBId = await Teacher.findOne({ employeeNo: teacherId }).exec();

      if( teacher.teacherId === teacherDBId._id.toString() ){
        const teacherSubjectTimeHour = Number(teacher.subject.start.split(':')[ 0 ]);
        const teacherSubjectTimeMinutes = Number(teacher.subject.start.split(':')[ 1 ]);

        const timeHours = Number(time.split(' ')[ 0 ].split(':')[ 0 ]);
        const timeMinutes = Number(time.split(' ')[ 0 ].split(':')[ 1 ]);

        const minute = teacherSubjectTimeMinutes + graceTime;
        const isMinutesOver = timeMinutes > (minute > 60 ? minute : minute - 60);
        const isHourOver = timeHours > teacherSubjectTimeHour;

        const isLate = !isHourOver && isMinutesOver;
        const isAbsent = isHourOver;
        const isPresent = !isHourOver && !isMinutesOver;

        const remark = 
          isLate 
            ? 'late' 
            : isAbsent 
              ? 'absent' 
              : isPresent
                ? 'present'
                : 'error';

        return remark;
      }
    }

    return null;
  }

  Student.findOne({ studentNo: id }, async ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

      if( doc ){
        if( doc.status === 'deactivated' ){
          return res
            .status( 403 )
            .json({
              message: 'Student is deactivated'
            });
        }
        else{
          const studentAttendance = await Attendance.findOne({ studentNo: id }).exec();
          const doesStudentHavePrevAttendance = !!studentAttendance;
          const dateToday = new Date().toDateString();
          const timeToday = new Date().toTimeString();

          const remark = await getRemark( timeToday, doc.teachers );
          const attendance = { date: dateToday, remark };

          if( !remark ) 
            return res
              .status( 403 )
              .json({
                message: 'You are not a teacher of this student'
              });

          if( doesStudentHavePrevAttendance ){
            const attendanceRecord = [ ...studentAttendance.attendance ]; 

            attendanceRecord.push( attendance );

            studentAttendance.attendance = attendanceRecord;

            studentAttendance.save( err => {
              if( err ) return res.sendStatus( 500 );

              return res
                .json({
                  studentName: doc.firstName + ' ' + doc.lastName 
                });
            });
          }
          else{
            const {
              studentNo,
              firstName,
              middleName,
              lastName,
            } = doc;

            Attendance.create({ 
              studentNo, 
              firstName, 
              middleName, 
              lastName,
              attendance, 
            }, err => {
              if( err ) return res.sendStatus( 500 );

              return res
                .json({
                  studentName: doc.firstName + ' ' + doc.lastName 
                });
            });
          }          
        }
      }
      else{
        return res
          .status( 404 )
          .json({
            message: 'Student does not exist'
          });
      }
  });
});


module.exports = router;