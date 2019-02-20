var project = require('../_project.js');
var gulp    = require('gulp');
var fs      = require('fs');
var cleanFile = require('../_utils.js').cleanFile;
var buildStatuses = require('../_utils.js').buildStatuses;
var request = require('request');
var axios   = require('axios');

gulp.task('status:get', async function () {
    // URL for data store
    let url = `https://api.netlify.com/api/v1/forms/${process.env.STATUS_FORM_ID}/submissions/?access_token=${process.env.API_AUTH}`;
    let statusFile = `./_data/statuses.json`;

    axios.get(url)
        .then(function (response) {
            // let bodyArray = JSON.parse(response.data);
            let statuses = response.data.map(buildStatuses);
            return project.storeData(statusFile, JSON.stringify(statuses));
        })
        .catch(function(error) {
            console.log(error);
        });


});