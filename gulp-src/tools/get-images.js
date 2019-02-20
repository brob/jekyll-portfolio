var project = require('../_project.js');
var getId = require('../_utils').getId;
var gulp    = require('gulp');
var fs      = require('fs');

require('../_utils.js');

gulp.task('image:get', function(done) {
    function imageNeeds() {
        // Creates array of all image IDs in JSON file
        let idList = fs.readFileSync('_data/statuses.json', 'utf8', function(err, contents) {
            return statuses;
        });
        let jsonEncoded = JSON.parse(idList);
        const statusImageIds = jsonEncoded.map(status => getId(status.imgUrl));
        return statusImageIds;
    } 
    function currentlyDownloaded() {
        // Creates array of images currently in the project
        const files = fs.readdirSync('./images/statusImages', (err, files) => {
            return files;        
        });
        const imageIds = files.map(imageUrl => getId(imageUrl));
        return imageIds;
    }

    const imageIdList = imageNeeds();
    const downloadedIdList = currentlyDownloaded();
    console.log(imageIdList, downloadedIdList);
    // Filters IDs to find images we need to download
    let needToDownload = imageIdList.filter(e => ! downloadedIdList.includes(e));

    needToDownload.forEach(fileId => {
        let url = `https://imgur.com/download/${fileId}`;
        let fileName = `./images/statusImages/${fileId}.jpg`
        download(url, fileName, function() {
            console.log(`Downloaded ${url}`);
        })
    });
});