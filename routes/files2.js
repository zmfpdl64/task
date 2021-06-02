var express  = require('express');
var router = express.Router();
var File2 = require('../models/File2');

router.get('/:serverFileName/:originalFileName', function(req, res){
  File2.findOne({serverFileName:req.params.serverFileName, originalFileName:req.params.originalFileName}, function(err, file){
    if(err) return res.json(err);
    console.log('난 파일:', file);
    var stream = file.getFileStream();
    if(stream){
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + file.originalFileName
      });
      stream.pipe(res);
    }
    else {
      res.statusCode = 404;
      res.end();
    }
  });
});

module.exports = router;