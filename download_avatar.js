var request = require('request');
var secret = require('./secret');
var fs = require('fs');

//repoOwner and repoName are now passed through cli

var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secret.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if(err){
      console.log("Please enter a valid repo name and owner");
    }
    var data = JSON.parse(body);
    cb(err, data);
  });
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  if(err){
    console.log("Make sure you entered a proper repo name and owner", err);
  }
  //Loops through each item in the result array
  for(var item of result){
    console.log('Avatar Url:', item.avatar_url);
    //Passes each avatar url and item.login as names for the jpgs downloaded
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
          console.log('Avatar downloaded.');
         })
         .pipe(fs.createWriteStream(filePath));
}
