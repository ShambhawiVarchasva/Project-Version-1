let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
   image: String,
   description: String,
   cost: Number,
   location: String,
   lat: Number,
   lng: Number,
   createdAt: { type: Date, default: Date.now },
   /*author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },*/
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

let Article = module.exports = mongoose.model('Article', articleSchema);
