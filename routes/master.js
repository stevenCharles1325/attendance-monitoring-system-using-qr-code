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
var TimeRecord = require('../models/TimeRecord');
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

  const verify = () => {
    if( !token ) return res.sendStatus( 401 );

    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if( err ) return res.sendStatus( 401 );

      req.user = user;
      next();
    });
  }

  User.findOne({ username: 'sysadmin' }, (err, sysadmin) => {
    if( err ) return res.sendStatus( 500 );

    if( !sysadmin ){
      User.create({ username: 'sysadmin', password: 'sysadmin', role: 'sysadmin' }, err => {
        if( err ) return res.sendStatus( 500 );

        verify();
      });
    }
    else{
      verify();
    }
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


// router.get('/get-subject-from-strand/strands/:strands', async ( req, res ) => {
//   if( !req.params.strands ) return res.sendStatus( 406 );

//   const strands = req.params.strands.split(',');

//   Strand.find().where('name').in( strands ).exec(( err, doc ) => {
//     if( err ) return res.sendStatus( 500 );

//     if( doc.length ){
//       console.log( doc );
//       return res.json(doc.reduce(( prev, accum ) => {
//         prev = [ ...prev, ...accum.subjects ];
//         return prev;    
//       }, []));
//     }
//     else{
//       return res.sendStatus( 200 );
//     }
//   }); 
// });


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
      Student.findOne({ _id: id }, (err, doc) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          if( doc.state === 'verified' ){
            User.findOne({ username: doc.studentNo }, (err, doc2) => {
              if( err ) return res.sendStatus( 500 );

              if( doc2 ){
                doc2.username = req.body.studentNo;
                doc2.save( err => {
                  if( err ) return res.sendStatus( 500 );

                  Student.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
                    if( err ) return res.sendStatus( 500 );

                    return res.json({ message: 'Successfully added a new Student' });
                  });
                });
              }
              else{
                return res.sendStatus( 404 );
              }
            });
          }
          else{
            Student.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
              if( err ) return res.sendStatus( 500 );

              return res.json({ message: 'Successfully added a new Student' });
            });
          }
        } 
        else{
          return res.sendStatus( 404 );
        }       
      });
      break;

    case 'teacher':
      Teacher.findOne({ _id: id }, (err, doc) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          if( doc.state === 'verified' ){
            User.findOne({ username: doc.employeeNo }, (err, doc2) => {
              if( err ) return res.sendStatus( 500 );

              console.log( doc2 );
              if( doc2 ){
                doc2.username = req.body.employeeNo;
                doc2.save( err => {
                  if( err ) return res.sendStatus( 500 );

                  Teacher.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
                    if( err ) return res.sendStatus( 500 );

                    return res.json({ message: 'Successfully added a new Teacher' });
                  });
                });
              }
              else{
                return res.sendStatus( 404 );
              }
            });
          }
          else{
            Teacher.findOneAndUpdate({ _id: id }, { ...req.body }, err => {
              if( err ) return res.sendStatus( 500 );

              return res.json({ message: 'Successfully added a new Teacher' });
            });
          }
        } 
        else{
          return res.sendStatus( 404 );
        }       
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
      const strands = [ 'ABM', 'HUMSS', 'STEM', 'HE', 'ICT' ];

      if(strands.includes( parent )){
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
            Strand.create({ name: parent, sections: [ name ] }, ( err, doc ) => {
              if( err ) return res.sendStatus( 500 );

              return res.json({ message: 'Successfully added a new Strand' });
            });
          }
        });      
      }
      else{
        return res.status( 404 ).json({ message: 'Strand does not exist!' });
      }
      break;

    case 'student':
      const remark = {
        category: 0,
        content: null
      };

      Student.create({ ...req.body, remark }, err => {
        if( err ) return res.sendStatus( 500 );

        const { studentNo, firstName, middleName, lastName, attendance } = req.body;

        Attendance.create({ 
          studentNo, 
          firstName, 
          middleName, 
          lastName,
          attendance: []
        }, err => {
          if( err ) return res.sendStatus( 500 );

          return res.json({ message: 'Successfully added a new Student' });
        });
      });
      break;

    case 'teacher':
      Teacher.create({ ...req.body }, err => {
        if( err ){
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

// Time-in
router.put('/student/update-attendance/id/:id/teacherId/:teacherId', async ( req, res, next ) => {
  const { id, teacherId } = req.params;

  const graceTime = 30; // 30minute grace time or period

  const getRemarkAndSubjectID = async ( time, teachers ) => {
    const teacherDBId = await Teacher.findOne({ employeeNo: teacherId }).exec();
    for( let teacher of teachers ){

      if( teacher.teacherId === teacherDBId._id.toString() ){
        const subjectName = teacher.subject.name;
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

        return [ teacher.teacherId, teacher.subject.id , remark, subjectName ];
      }
    }

    return [ null, null ];
  }

  const getSubjectName = async ( time, teachers ) => {
    for( let teacher of teachers ){
      const teacherDBId = await Teacher.findOne({ employeeNo: teacherId }).exec();

      if( teacher.teacherId === teacherDBId._id.toString() ){
        
      }
    }

    return [ null, null ];
  }

  const checkIfStudentHasAttendanceToday = ( attendanceRecord, dateToday ) => {
    for( let attRec of attendanceRecord ){
      if( attRec.date === dateToday ){
        return true;
      }
    }
  }

  const getFullName = ({ firstName, middleName, lastName }) => {
    const isMiddleNameExist = !!middleName.length;

    return isMiddleNameExist
      ? `${lastName}, ${firstName} ${middleName}`
      : `${lastName}, ${firstName}`;
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

          const [ teacherId, subjectId, remark, subjectName ] = await getRemarkAndSubjectID( timeToday, doc.teachers );
          const attId = uniqid();
          const attendance = {
            id: attId,
            studentNo: id,
            fullName: getFullName( doc ),
            teacherId, 
            subjectId,
            date: dateToday, 
            remark,
            status: 'timein',
            subject: subjectName
          };

          if( !remark ) 
            return res
              .status( 403 )
              .json({
                message: 'You are not a teacher of this student'
              });

          if( doesStudentHavePrevAttendance ){
            const attendanceRecord = [ ...studentAttendance.attendance ]; 

            const isStudentHasAttendance = checkIfStudentHasAttendanceToday( attendanceRecord, dateToday );

            if( isStudentHasAttendance ){
              return res
                .json({
                  message: 'Student already had attendance'
                });
            }
            else{
              attendanceRecord.push( attendance );
              studentAttendance.attendance = attendanceRecord;
              studentAttendance.save( err => {
                if( err ) return res.sendStatus( 500 );

                if( remark !== 'absent' ){
                  doc.currentAttendanceID = attId;
                  doc.currentSubject = subjectName;
                  doc.save( err => {
                    if( err ) return res.sendStatus( 500 );

                    return res
                      .json({
                        studentName: doc.firstName + ' ' + doc.lastName 
                      });
                  });
                }
                else{
                  return res
                    .json({
                      studentName: doc.firstName + ' ' + doc.lastName 
                    });
                }
              });
            }
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

              doc.currentAttendanceID = attId;
              doc.currentSubject = subjectName;
              doc.save( err => {
                if( err ) return res.sendStatus( 500 );

                return res
                  .json({
                    studentName: doc.firstName + ' ' + doc.lastName 
                  });
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


router.get('/teacher/:teacherDBID/students/attendance', authentication, async ( req, res ) => {
  const { teacherDBID } = req.params;

  try{
    const allStudentsOfThisTeacher = await Student.find().$where(`this.teachers.map(({ teacherId }) => teacherId).includes('${teacherDBID}')`);

    if( allStudentsOfThisTeacher.length ){
      const attendance = [];

      for( let student of allStudentsOfThisTeacher ){
        const allAttendance = await Attendance.find({ studentNo: student.studentNo });

        allAttendance.forEach( att => {
          att.attendance.forEach( data => {
            if( data.teacherId === teacherDBID ){
              attendance.push( data );
            }
          });
        });
      }

      return res.json( attendance );
    }
    else{
      return res.end();
    }
  }
  catch( err ){
    throw err;
    return res.sendStatus( 500 );
  }
});

router.get('/teacher/:id', authentication, async ( req, res ) => {
  const { id } = req.params;

  Teacher.findOne({ employeeNo: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      return res.json({ id: doc._id });
    }
    else{
      return res.sendStatus( 404 );      
    }
  });
});

router.put('/student/remark/:id', authentication, async ( req, res ) => {
  const { id } = req.params;

  Student.findOne({ studentNo: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      doc.remark = req.body;

      doc.save( err => {
        if( err ) return res.sendStatus( 500 );

        return res.end();
      });
    }
    else{
      return res.sendStatus( 404 );      
    }
  });
});


router.get('/get-student/remark/:id', authentication, async ( req, res ) => {
  const { id } = req.params;

  Student.findOne({ studentNo: id }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      return res.json( doc.remark );
    }
    else{
      return res.sendStatus( 404 );      
    }
  });
});


router.put('/time-out/student/:studentId', authentication, async ( req, res ) => {
  const { studentId } = req.params;

  try{
    const attendance = await Student.findOne({ studentNo:studentId }).exec();
    const attendanceId = attendance.currentAttendanceID;
    
    // if( !attendanceId ) return res.sendStatus( 404 );
    Attendance.findOne({ studentNo: studentId }, ( err, doc ) => {
      if( err ) return res.sendStatus( 500 );

      if( doc ){
        if( doc.attendance.length ){
          for( let index in doc.attendance ){

            if( doc.attendance[ index ].id === attendanceId ){
              const tempAttendance = doc;

              tempAttendance.attendance[ index ].status = 'timeout';

              doc.attendance = tempAttendance.attendance;
              doc.save( err => {
                if( err ) {
                  console.log( err );
                  return res.sendStatus( 500 );
                }

                Student.findOne({ studentNo: studentId }, ( err, student ) => {
                  if( err ) return res.sendStatus( 500 );

                  if( student ){
                    student.currentAttendanceID = null;
                    student.currentSubject = null;

                    student.save( err => {
                      if( err ) return res.sendStatus( 500 );

                      return res.sendStatus( 200 );
                    });
                  }
                  else{
                    return res.sendStatus( 404 );
                  }
                });
              });
            }
          }
        } 
        else{
          return res.sendStatus( 200 );
        }
      }
      else{
        return res.sendStatus( 404 );
      }
    });
  }
  catch( err ){
    console.log( err );
    return res.sendStatus( 500 );
  }
});


router.get('/attendances', authentication, async ( req, res ) => {
  Attendance.find({}, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      return res.json( doc.reduce(( prev, curr ) => [ ...prev, ...curr.attendance ], []) );
    }
    else{
      return res.end();
    }
  });
});


router.put('/update-profile-picture/userId/:userId', authentication, async ( req, res ) => {
  const { userId } = req.params;

  if( !req.files ) return res.sendStatus( 404 );

  User.findOne({ username: userId }, ( err, user ) => {
    if( err ) return res.sendStatus( 500 );

    if( user ){
      const imagesPath = path.join( __dirname, '../client/public/images/user' );
      const image = req.files.userPicture;

      const fileName = `${userId}-${new Date().getTime()}.png`;
      const destinationPath = path.join(imagesPath, `/${fileName}`);

      fs.readdir( imagesPath, ( err, files ) => {
        if( err ) return res.sendStatus( 500 );

        for( let file of files ){

          if( file === fileName ){
            try{
              fs.unlinkSync(path.join( imagesPath, `/${file}` ));
            }
            catch( err ){
              console.log( err );
              return res.sendStatus( 500 );
            }
          }
        }

        image.mv( destinationPath, err => {
          if( err ) return res.sendStatus( 500 );

          user.imageSrc = '/images/user/' + fileName;

          user.save( err => {
            if( err ) return res.sendStatus( 500 );

            return res.json({
              imageSrc: '/images/user/' + fileName
            });
          });
        });
      });
    }
    else{
      return res.sendStatus( 404 );
    }
  });
});


router.get('/get-profile-picture/userId/:userId', authentication, async ( req, res ) => {
  const { userId } = req.params;

  User.findOne({ username: userId }, ( err, user ) => {
    if( err ) return res.sendStatus( 500 );

    if( user ){
      return res.json({
        imageSrc: user.imageSrc
      });
    }
    else{
      return res.sendStatus( 404 );
    }
  });
});

module.exports = router;