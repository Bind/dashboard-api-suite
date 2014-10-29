var request = require("request");
var quickRequest = function(url, id, apikey){
  //quickRequest expects a dictionary with all keys associated with META tags. 
  //pass the body of the request as a key Body: {'dictionary'}
  //returns request object

   return request(
    { method: 'GET'
    , uri: url
    , gzip: false
    , id: id
    , apikey: apikey
    }
  , function (error, response, body) {
      // body is the decompressed response body
      console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
      console.log('the decoded data is: ' + body)
    }
  ).on('data', function(data) {
    // decompressed data as it is received
    console.log('decoded chunk: ' + data)
  })
  .on('response', function(response) {
    // unmodified http.IncomingMessage object
    response.on('data', function(data) {
      // compressed data as it is received
      console.log('received ' + data.length + ' bytes of compressed data')
    })
  })
 


}

