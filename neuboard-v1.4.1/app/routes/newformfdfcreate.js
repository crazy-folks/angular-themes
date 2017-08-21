

module.exports = function (api) {

  api.route('/formfdfcreate')

  // create a process (accessed at POST http://localhost:8080/api/process)
  // ok work
    .post(function (req, res) {

        var pdfFiller   = require('pdffiller');

        var sourcePDF = "app/forms/source/ZurichILI.pdf";

        var FDF_data = pdfFiller.generateFDFTemplate( sourcePDF, nameRegex, function(err, fdfData) { 
            if (err) throw err;
            console.log(fdfData);
        });

    });
};   