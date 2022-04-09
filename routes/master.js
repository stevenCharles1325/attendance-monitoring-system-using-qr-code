/* ========================

    	*REGULAR ROUTES*

==========================*/
require('dotenv').config();


var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

// MODELS
var Token = require('../models/Token');
var User = require('../models/User');
var Student = require('../models/StudentRecord');
var Teacher = require('../models/TeacherRecord');
var Semester = require('../models/Semester');
// var SchoolYear = require('../models/SchoolYear');
var Strand = require('../models/Strand');


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

router.get('/get-single-user/type/:type/id/:id', async ( req, res ) => {
  const { type, id } = req.params;

  if( !type || !id ) return res.sendStatus( 404 );

  switch( type ){
    case 'student':
      Student.findOne({ username: id }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });
      break;

    case 'teacher':
      Teacher.findOne({ username: id }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        return res.json( doc );
      });   
      break;   

    default:
      return res.sendStatus( 200 );  
  }
});

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
      Strand.find({}).sort({ name: 1 }).exec(( err, doc ) => {
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
      Strand.create({ name: req.body.name.toUpperCase() }, err => {
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
        if( err ) return res.sendStatus( 500 );

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


module.exports = router;