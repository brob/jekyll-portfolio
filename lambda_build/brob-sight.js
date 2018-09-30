'use strict';

var request = require("request");

// populate environment variables locally.
require('dotenv').config()




export function handler(event, context, callback) {
    const doingString = event.queryStringParameters.doing;
    const imgUrl = event.queryStringParameters.imgUrl;
    
    if(imgUrl) {
      let urlPieces = imgUrl.split('/');
      let photoId = urlPieces[urlPieces.length - 1];
      if (photoId.endsWith('.jpg')) {
        let idSplit = photoId.split('.');
        photoId = idSplit[0];
        console.log(`Download link: ${photoId}`);
      } 
      var imgDownloadLink = `https://imgur.com/download/${photoId}`      
      console.log(`Download link: ${imgDownloadLink}`);
    } 
    // now we have the data, let's massage it and post it to the approved form
    var payload = {
      'form-name' : "happening-post",
      'received': new Date().toString(),
      'doing': doingString,
      'imgUrl': imgDownloadLink
    };

    console.log(payload);
    var approvedURL = "https://bryanlrobinson.com/bryan-sight";

    request.post({'url':approvedURL, 'formData': payload }, function(err, httpResponse, body) {
      var msg;
      console.log('inside post');
      if (err) {
        console.log('inside error');

        msg = 'Post to approved comments failed:' + err;
        console.log(msg);
      } else {
        console.log('inside else');
        console.log(httpResponse.statusCode);
        msg = 'Post to approved comments list successful.'
        console.log(msg);
      }
      var msg = "Comment registered. Site deploying to include it.";

      console.log(msg);
      callback(null, {
        statusCode: 200,
        body: msg
      });
      return console.log(msg);
    });
  };
