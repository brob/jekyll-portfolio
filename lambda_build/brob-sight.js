



exports.handler = async (event, context) => {
    const doingString = event.queryStringParameters.doing;
    const imgUrl = event.queryStringParameters.imgUrl;
    const happeningObject = {
      'doingString': doingString,
      'imgUrl': imgUrl
    }

    console.log(happeningObject);

    return {
      statusCode: 200,
      body: JSON.stringify({happeningObject})
    };
  };
