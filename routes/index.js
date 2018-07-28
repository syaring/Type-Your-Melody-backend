const express = require('express');
const router = express.Router();
const cors = require('cors');

const fs = require('file-system');
const PDFDoc = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');


//s3 server
const AWS = require('aws-sdk');
//const uuid = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: 'AKIAIKBM7V7Q4W63ZV4A',
  secretAccessKey: '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'
});


/* GET home page. */
router.get('/', cors(), function(req, res, next) {
  res.render('index', { title: 'Expsress' });
});

router.post('/toPDF', cors(), (req, res, next) => {
  var doc = new PDFDoc();
  var svg = req.body.tagData;
  var stream = fs.createWriteStream('notes.pdf');
  SVGtoPDF(doc, svg, 0, 0);
  
  PDFDoc.prototype.addSVG = function (svg, x, y, options) {
    return SVGtoPDF(this, svg, x, y, options), this;
  }

  doc.addSVG(svg, 0, 0);

  doc.end();

  var params = {
    Key: `${Date.now().toString()}-notes.pdf`,
    Body: doc,
    Bucket: 'type-your-melody',
    ContentType: 'application/pdf',
    ACL: 'public-read'
  }

  s3.upload(params, function(err, data) {
    if(err) {
      res.status(400).json({
        msg: "upload failed"
      });
    } else if(data) {
      res.status(200).json({
        url: data.Location
      });
    }
  });
});

router.options('/toPDF', cors(), function (req, res, next) {
  res.status(200).end();
});

module.exports = router;
