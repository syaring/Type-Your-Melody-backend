var express = require('express');
var router = express.Router();
var cors = require('cors');

var fs = require('file-system');
var PDFDoc = require('pdfkit');
var SVGtoPDF = require('svg-to-pdfkit');


/* GET home page. */
router.get('/', cors(), function(req, res, next) {
  res.render('index', { title: 'Expsress' });
});

router.post('/toPDF', cors(), function(req, res, next) {
  var doc = new PDFDoc();
  var stream = fs.createWriteStream('notes.pdf');
  var svg = req.body.tagData;

  SVGtoPDF(doc, svg, 0, 0);

  stream.on('finish', function() {
    console.log(fs.readFileSync('notes.pdf'))
  });

  doc.pipe(stream);
  doc.end();
  // console.log(req.body.tagData);

  res.status(200).json({
    msg: "done"
  });
});

router.options('/toPDF', cors(), function (req, res, next) {
  res.status(200).end();
});

module.exports = router;
