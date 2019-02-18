var project = require('../_project.js');
var gulp    = require('gulp');
var fs      = require('fs');
var cleanFile = require('../_utils.js').cleanFile;
var cleanFile = require('../_utils.js').buildStatuses;
var cleanFile = require('../_utils.js').getId;
var request = require('request');

gulp.task('status:get', function () {
    // URL for data store
    let url = `https://api.netlify.com/api/v1/forms/${process.env.STATUS_FORM_ID}/submissions/?access_token=${process.env.API_AUTH}`;
    let statusFile = `./_data/statuses.json`;

    cleanFile(statusFile, function() {
        // Erases JSON file
        console.log(`${statusFile} cleaned`);
        request(url, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                let bodyArray = JSON.parse(body);
                let statuses = bodyArray.map(buildStatuses);

                // Write the status to a data file
                fs.writeFileSync(statusFile, JSON.stringify(statuses, null, 2), function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Status data saved.");
                    }
                });
                console.log(`${statusFile} rebuilt from data`);
    
            } else {
                console.log("Couldn't get statuses from Netlify");
            }
        });
    });
    
});