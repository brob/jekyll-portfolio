var gulp    = require('gulp');
var fs      = require('fs');
var request = require('request');

module.exports = {
    download: function(uri, filename, callback) {
        request.head(uri, function(err, res, body){      
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    },
    cleanFile: function(filePath, callback) {
        fs.truncate(filePath, 0, callback);
    },
    getId: function(imageUrl) {
        if (imageUrl.endsWith('.jpg')) {
            // protects against imgur URL changes from 'app' source
            let idSplit = imageUrl.split('.j');
            imageUrl = idSplit[0];
        }
        let imgUrlSplit = imageUrl.split('/');
        let imgId = imgUrlSplit[imgUrlSplit.length - 1];
    
        return imgId;
    },
    buildStatuses: function(body) {
        let data = body.data;
        let imgId = getId(data.imgUrl);
    
        const status = {
            status: data.doing,
            imgUrl: data.imgUrl,
            localUrl: `/images/statusImages/${imgId}.jpg`,
            date: body.created_at
        };
        return status;
    }

}
