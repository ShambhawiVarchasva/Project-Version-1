var express = require('express');
var router = express.Router();

const request=require('request');
router.get('/', (req, res) => {
    res.render('captcha');
  });
router.post('/', (req, res) => {
    if(
      req.body.captcha === undefined ||
      req.body.captcha === '' ||
      req.body.captcha === null
    ){
      return res.json({"success": false, "msg":"Please select captcha"});
    }
  
    // Secret Key
    const secretKey = '6LeqEXUUAAAAAHjyVhMb1C_uZ9izJuP64KXv5o2J';
  
    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
  
    // Make Request To VerifyURL
    request(verifyUrl, (err, response, body) => {
      body = JSON.parse(body);
      console.log(body);
  
      // If Not Successful
      if(body.success !== undefined && !body.success){
        return res.json({"success": false, "msg":"Failed captcha verification"});
      }
  
      //If Successful
      return res.json({"success": true, "msg":"Captcha passed"});
    });
  });

  module.exports=router;