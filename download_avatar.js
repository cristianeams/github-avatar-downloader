var request = require('request');
var secret = require('./secret');

//console.log("Welcome to the GitHub Avatar Downloader");

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);
  //Loops through each item in the result array
  for(var item of result){
    console.log('Avatar Url:', item.avatar_url);
  }
});

function downloadImageByURL(url, filePath) {
  //requrie request and fs modules
  var request = require('request');
  var fs = require('fs');
  //Chained functions to get request
  request.get(url)
         .on('error', function (err) {
          throw err;
         })
         .on('response', function (response) {
          console.log('Response Status Code: ', response.statusCode)
         })
         .pipe(fs.createWriteStream(filePath));


  // ...
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatar/kvirani.jpg")