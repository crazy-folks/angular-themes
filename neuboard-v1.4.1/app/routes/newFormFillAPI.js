

module.exports = function (api) {

  api.route('/formfill')

  // create a process (accessed at POST http://localhost:8080/api/process)
  // ok work
    .post(function (req, res) {

        var pdfFiller   = require('pdffiller');

        var sourcePDF = "app/forms/source/ZurichILI.pdf";
        var destinationPDF =  "app/forms/dest/FilledZurichILI.pdf";

        var data = {
            "Product Name" : "Life Insurance",
            "Specified Amount of Insurance" : "$100,000",
            "Option A Level" : "On",
            "Option B Increasing" : "Off",
            "Option C Specified Amount plus return of net premiums paid" : "Off",
            "Option D Specified Amount plus return of net premiums paid plus interest" : "Off",
            "First Proposed Insured" : "First",
            "1 Name First Middle Initial Last" : "Atma Shetty"
        };

        pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) {
            if (err) throw err;
            console.log("In callback (we're done).");
            
        });

    });
};   