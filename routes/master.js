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
var SectionStrand = require('../models/SectionStrand');


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


router.delete('/sign-out', authentication, async ( req, res ) => {
  Token.deleteOne({ code: req.body.token }, (err) => {
    if( err ) return res.sendStatus( 500 );

    return res.sendStatus( 200 );
  });
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

  SectionStrand.find({ type }).sort({ name: 1 }).exec(( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    return res.json( doc );
  });      
});


router.post('/add/type/:type', authentication, async ( req, res ) => {
  const { type } = req.params;

  if( !req.body ) return res.sendStatus( 406 );

  switch( type ){
    case 'section':
      SectionStrand.create({ name: req.body.name.toUpperCase(), type }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Section' });
      });
      break;

    case 'strand':
      SectionStrand.create({ name: req.body.name.toUpperCase(), type }, err => {
        if( err ) return res.sendStatus( 500 );

        return res.json({ message: 'Successfully added a new Strand' });
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

    default:
      return res.sendStatus( 404 );
  }
});


module.exports = router;