var request = require('request');
var secret = require('./secret');
var fs = require('fs');
//repoOwner and repoName are now passed through cli

var repoOwner = process.argv[2];
var repoName = process.argv[3];

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

getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  //console.log("Result:", result);
  //Loops through each item in the result array
  for(var item of result){
    console.log('Avatar Url:', item.avatar_url);
    //calls function, passes each avatar url as url, and item>.login as names for the avatars downloaded
    downloadImageByURL(item.avatar_url, "avatars/" + item.login + '.jpg');
  }
});

function downloadImageByURL(url, filePath) {
  //Chained functions to get request
  request.get(url)
         .on('error', function (err) {
          throw err;
         })
         .on('response', function (response) {
          console.log('Response Status Code: ', response.statusCode)
         })
         .pipe(fs.createWriteStream(filePath));
}
