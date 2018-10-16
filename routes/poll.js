const express=require('express');
const router=express.Router();
var pusher=require('pusher');
var pusher = new pusher({
    appId: '621753',
    key: '65effbd675f2c9966ee3',
    secret: 'eff70d90708445fd1230',
    cluster: 'ap2',
    encrypted: true
  });
router.get('/',(req,res)=>{
    res.render('poll');
});
router.post('/',(req,res)=>{
    pusher.trigger('os-poll', 'os-vote', {
      
        points:1,
        os:req.body.os
      });
      return res.json({success:true,message:'Thank You'});
});
module.exports=router;