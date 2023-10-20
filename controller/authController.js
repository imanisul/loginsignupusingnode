  const userModel = require("../model/userSchema.js");
  const emailValidator = require('email-validator');
  const bcrypt = require('bcrypt')


  const signUp = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    /// every field is required
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Every field is required"
      });
    }

    //email vaildation

    const validEmail = emailValidator.validate(email);
    if(!validEmail){
      return res.status(400).json({
          success: false,
          message:"Please enter a valid Email address",
      })
    }

    try {
      /// send password not match err if password !== confirmPassword
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "password and confirm Password does not match ❌"
        });
      }

      const userInfo = new userModel(req.body);

      // userSchema "pre" middleware functions for "save" will hash the password using bcrypt
      // before saving the data into the database
      const result = await userInfo.save();
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      /// send the message of the email is not unique.
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: `Account already exist with the provided email ${email} 😒`
        });
      }

      return res.status(400).json({
        message: error.message
      });
    }
  };


  const signIn = async (req, res) =>{
      const {email, password} = req.body;

      if (!email || !password){
          return res.status(400).json({
              success :false ,
              message: 'Enter your email and password'
          })

      }


      try {
        const user = await userModel
          .findOne({
              email
          })  
          .select('+password')  

      if (!user || !(await bcrypt.compare(password, user.password))){
          return res.status(400).json({
            success: false,
            message : 'Invalid Password'
          })
      }   
      
      const token = user.jwtToken();
      user.password = undefined;


      const cookieOption = {
        maxAge: 24*60*60*100,
        httpOnly: true
      } ;
      res.cookie('token', token, cookieOption);
      res.status(200).json({
        success: true,
        data: user
      })
      } catch (error) {
          res.status(400).json({
              success: false,
              message: error.message
          })
      }
      
  }

  const getUser = async(req, res, next) =>{
       const userId = req.user.id

       try {
          const user = await userModel.findById(userId);
          return res.status(200).json({
            success: true,
            data: user
          })
       } catch (err) {
           return res.status(400).json({
            success: false,
            message: err.message
           })
       }
  }

  const logout = (req, res) =>{
       try {

        const cookieOption = {
          expriesIn: new Date(),
          httpOnly: true
        }
        res.cookie("token", null, cookieOption);
        res.status(200).json({
          success :true ,
          message: 'Logged out succesfully'
        })
       } catch (error) {
        res.status(400).json({
          success :false ,
          message: error.message
        })
       }  
  }



  module.exports = {
    signUp,
    signIn,
    getUser,
    logout
  };