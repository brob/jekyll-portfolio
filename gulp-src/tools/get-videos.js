var project = require('../_project.js');
var gulp    = require('gulp');
var axios   = require('axios');
var parseString = require('xml2js').parseString;



function cleanRSS(data) {
    var desiredData = {};
    
    desiredData['title'] = data.title;
    desiredData['description'] = data['media:group']['media:description'];
    desiredData['link'] = data['link']['$']['href'];
    desiredData['thumbnail'] = data['media:group']['media:thumbnail']['$']['url'];
    return desiredData;
}






/*
  Get Videos from youtube RSS
*/
gulp.task('get:videos', async function () {

    axios.get('https://www.youtube.com/feeds/videos.xml?channel_id=UCTLrD1MTRbjxtFCRaFXqkdQ')
        .then(function (response) {
            parseString(response.data, {explicitArray:false}, function (err, result) {
                console.log(result);
                var data = result.feed.entry.map(cleanRSS);

                project.storeData("./_data/videos.json", JSON.stringify(data));
            });        
        }).catch(function(err) {
            console.log(err);
        })


});
