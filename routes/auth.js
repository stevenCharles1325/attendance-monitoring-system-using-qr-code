/* ========================

    *AUTHENTICATION ROUTES*

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

const MASTER_ROLE = 'sysadmin';

const requestAccessToken = ( user ) => {
  return jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' } );
};


router.post('/sign-in', async (req, res, next) => {
  const { username, password } = req.body;

  const signIn = () => {
    User.findOne({ username: username, password: password }, (err, doc) => {
      if( err ) return res.sendStatus( 500 );

      if( doc ){
        const user = { name: username, role: doc.role };
        const accessToken = requestAccessToken( user );
        const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );

        Token.create({ code: refreshToken }, err => {
          if( err ) return res.sendStatus( 500 );

          return res.json({
            message: `Welcome ${ username }!`,
            role: doc.role,
            accessToken,
            refreshToken
          });
        });
      }
      else{
        return res.status( 403 ).json({
          message: 'Incorrect password or username'
        });
      }
    });
  }

  Student.findOne({ studentNo: username }, ( err, doc ) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      if( doc.status === 'deactivated' ){
        return res.status( 403 ).json({ message: 'Account is deactivated' });
      }
      else{
        signIn();
      }
    }
    else{
       Teacher.findOne({ employeeNo: username }, ( err, doc ) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          if( doc.status === 'deactivated' ){
            return res.status( 403 ).json({ message: 'Account is deactivated' });
          }
          else{
            signIn();
          }
        }
        else{
          signIn();
        }
      });
    }
  });

  
});


/*==============================================

    If the user will sign-up, then the user has
    to go in this route first to check if the
    signing-up student does really exist.

================================================*/

router.post('/verify/user/:id', async(req, res) => {
  const { id } = req.params;
  const { birthDate } = req.body;

  User.findOne({ username: id, state: 'verified' }, (err, doc) => {
    if( err ) return res.sendStatus( 500 );

    if( doc ){
      return res
        .status( 403 )
        .json({
          message: 'This account already exists.'
        });
    }
    else{
      Student.findOne({ studentNo: id }, (err, doc) => {
        if( err ) return res.sendStatus( 500 );

        if( doc ){
          return res
            .json({ 
              role: 'student', 
              message: 'Student number has been verified'  
            });
        }
        else{
          Teacher.findOne({ employeeNo: id }, (err, doc) => {
            if( err ) return res.sendStatus( 500 );

            if( doc ){
              return res
                .json({ 
                  role: 'teacher', 
                  message: 'Employee number has been verified'  
                });
            }
            else{
              return res
                .status( 404 )
                .json({
                  message: 'ID number does not exist!'
                });
            }
          });
        }
      });
    }
  });
});


router.post('/sign-up', async (req, res, next) => {
  const { username, password, role } = req.body;

  switch( role ){
    case 'student':
      Student.findOneAndUpdate({ studentNo: username }, { state: 'verified', status: 'activated' }, err => {
        if( err ) return res.sendStatus( 500 );
      });
      break;

    case 'teacher':
      Teacher.findOneAndUpdate({ employeeNo: username }, { state: 'verified', status: 'activated' }, err => {
        if( err ) return res.sendStatus( 500 );
      });
      break;

    default:
      return res.sendStatus( 404 );
  }

  User.create({ username, password, role }, err => {
    if( err ) return res.sendStatus( 500 );

    const user = { name: username, role: role };
    const accessToken = requestAccessToken( user );
    const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );

    Token.create({ code: refreshToken }, err => {
      if( err ) return res.sendStatus( 500 );

      return res.json({
        message: `Welcome ${ username }!`,
        role,
        accessToken,
        refreshToken
      });
    });
  });
});


router.post('/refresh-token', async ( req, res ) => {
  const { rtoken } = req.body;

  if( !rtoken ) return res.sendStatus( 403 );

  Token.find({ code: rtoken }, (err, token) => {
    if( err ) return res.sendStatus( 500 );

    if( !token && !token.length ) return res.sendStatus( 403 );

    jwt.verify( rtoken, process.env.REFRESH_TOKEN_SECRET, ( err, user ) => {
      if( err ) return res.sendStatus( 403 );

      const accessToken = requestAccessToken({ name: user.name });

      return res.status( 200 ).json({ 
        message: 'Token has been refreshed successfully ', 
        accessToken: accessToken
      });
    });
  });
});


module.exports = router;
