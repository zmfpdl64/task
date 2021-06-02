var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

// schema
var fileSchema1 = mongoose.Schema({
  originalFileName:{type:String},
  serverFileName:{type:String},
  size:{type:Number},
  user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
  isDeleted:{type:Boolean, default:false},
});

// instance methods
fileSchema1.methods.processDelete = function(){
  this.isDeleted = true;
  this.save();
};
fileSchema1.methods.getFileStream = function(){
  var stream;
  var filePath = path.join(__dirname,'..','uploadedFiles2',this.serverFileName);
  var fileExists = fs.existsSync(filePath);
  if(fileExists){
    stream = fs.createReadStream(filePath);
  }
  else {
    this.processDelete();
  }
  return stream;
};

// model & export
var File2 = mongoose.model('file2', fileSchema1);

// model methods
File2.createNewInstance = async function(file,user){
  return await File2.create({
      originalFileName:file.originalname,
      serverFileName:file.filename,
      size:file.size,
      user1:user,
    }); 
};

module.exports = File2;