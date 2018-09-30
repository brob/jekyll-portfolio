'use strict';

var request = require("request");

// populate environment variables locally.
require('dotenv').config()




exports.handler = async (event, context) => {
    const doingString = event.queryStringParameters.doing;
    const imgUrl = event.queryStringParameters.imgUrl;
    let urlPieces = imgUrl.split('/');
    let photoId = urlPieces[urlPieces.length - 1];
    let imgDownloadLink = `https://imgur.com/download/${photoId}`

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

      return true;
    });



    return {
      statusCode: 200,
      body: JSON.stringify({payload})
    };
  };
