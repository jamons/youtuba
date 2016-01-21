function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    gapi.client.setApiKey('AIzaSyCR5In4DZaTP6IEZQ0r1JceuvluJRzQNLE');
}

var inputKeySearch = "";

function search() {
    inputKeySearch = document.getElementById("keyWordSearch").value;
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        q: inputKeySearch,
        type: "video"
    });

    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
  showResponse(response);
}

var catchSearchByKeywordId = [];
var catchSearchByKeywordTitle = [];
var catchSearchByKeywordDesc = [];

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
  var responseString = JSON.stringify(response, '', 2);
  document.getElementById('response').innerHTML += responseString;
  for (var i =0; i<response.items.length; i++) {
    catchSearchByKeywordTitle[i] = response.items[i].snippet.title;
    catchSearchByKeywordDesc[i] = response.items[i].snippet.description;
    catchSearchByKeywordId[i] = response.items[i].id.videoId;
    document.getElementById("dispInfoTitle" + i).innerHTML = catchSearchByKeywordTitle[i];
    document.getElementById("dispInfoDesc" + i).innerHTML = catchSearchByKeywordDesc[i];
  }
}

function onYouTubeIframeAPIReady() {
}

var videoListIds = [];
var videoCount = 0;

function onPlayerStateChange(event) {
  if (event.data == 0) {
    if (videoCount >= videoListIds.length) {
      videoCount = 0;
      player.loadVideoById(videoListIds[videoCount]);
      videoCount++;
    }
    else {
      player.loadVideoById(videoListIds[videoCount]);
      videoCount++;
      console.log("");
    }
  }
}

function onPlayerReady() {
}

var player = {};
function createPlayer() {
  player = new YT.Player('player', {
    height: '190',
    width: '450',
    videoId: videoListIds[0],
    playerVars: { 'autoplay': 1 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videoCount++;
}

var playByKeywordId = 0;
var countSelections = 0;
function selectByButton0() {
  console.log("selectByButton0");
  playByKeywordId = 0;
  videoListIds[countSelections] = catchSearchByKeywordId[0];
  countSelections++;
  addInfo2Playlist(0);
}

function selectByButton1() {
  console.log("selectByButton1");
  playByKeywordId = 1;
  videoListIds[countSelections] = catchSearchByKeywordId[1];
  countSelections++;
  addInfo2Playlist(1);
}

function selectByButton2() {
  console.log("selectByButton2");
  playByKeywordId = 2;
  videoListIds[countSelections] = catchSearchByKeywordId[2];
  countSelections++;
  addInfo2Playlist(2);
}

function selectByButton3() {
  console.log("selectByButton3");
  playByKeywordId = 3;
  videoListIds[countSelections] = catchSearchByKeywordId[3];
  countSelections++;
  addInfo2Playlist(3);
}

function selectByButton4() {
  console.log("selectByButton4");
  playByKeywordId = 4;
  videoListIds[countSelections] = catchSearchByKeywordId[4];
  countSelections++;
  addInfo2Playlist(4);
}

function playListButton() {
  createPlayer();
}

function nextVidButton() {
  if(videoCount < videoListIds.length) {
    player.loadVideoById(videoListIds[videoCount]);
    videoCount++;
  }
  else {
    videoCount = 0;
    player.loadVideoById(videoListIds[videoCount]);
    videoCount++;
  }
}

var add2PlaylistInfo =[];

function addInfo2Playlist(l) {
  add2PlaylistInfo.push(catchSearchByKeywordTitle[l]);
}

var countDeleted = 0;
var pos2delete = 0;
var deletedVideosArr = [];
var belowVideosDeleted = 0;

function displayPlaylist() {
  for(var k = 0; k < add2PlaylistInfo.length; k++) {
    var para = document.createElement("P");
    var trackNo = document.createTextNode("track No. " + k + " ");
    var info = document.createTextNode(add2PlaylistInfo[k]);
    para.id = "added2playlist" + k;
    para.addEventListener("click", function playDirect() {
      var ref = parseInt(this.id.slice(14,15));
      player.loadVideoById(videoListIds[ref]);
      videoCount = ref + 1;
    });
    para.appendChild(trackNo);
    para.appendChild(info);
    document.getElementById("dispPlaylistContainer").appendChild(para);
    var btn = document.createElement("BUTTON");
    btn.id = "btnDelete" + k;
    var text = document.createTextNode("Delete video");
    btn.appendChild(text);
    btn.addEventListener("click", function deleteVideo() {
      console.log("countDeleted: " + countDeleted);
      if(this.id.length === 10) { pos2delete = parseInt(this.id.slice(9,10)); }
      else if(this.id.length === 11) { pos2delete = parseInt(this.id.slice(9,11)); }
      else if(this.id.length === 12) { pos2delete = parseInt(this.id.slice(9,12)); }
      console.log("pos2delete: " + pos2delete);
      console.log("videos length: " + videoListIds.length);
      console.log(videoListIds);
      deletedVideosArr[countDeleted] = pos2delete;
      console.log("deletedVideosArr:  " + deletedVideosArr);
      belowVideosDeleted = deletedVideosArr.filter(lower2Delete).length;
      console.log("belowVideosDeleted: " + belowVideosDeleted);
      var video2deleteByPosition = pos2delete - belowVideosDeleted;
      console.log("indexVideo2delete: " + video2deleteByPosition);
      console.log("to delete: " + videoListIds.splice(video2deleteByPosition, 1));
      videoListIds.splice(video2deleteByPosition, 0);
      console.log("delete zero 0")
      countDeleted++;
      // half sec video youtube dhj67sSPEwA
      console.log(videoListIds);
      var removeFromPlaylist = document.getElementById("added2playlist" + pos2delete);
      var removeBtnDel = document.getElementById("btnDelete" + pos2delete);
      removeFromPlaylist.parentElement.removeChild(removeFromPlaylist);
      removeBtnDel.parentElement.removeChild(removeBtnDel);
    });
    document.getElementById("dispPlaylistContainer").appendChild(btn);
  }
}

function lower2Delete (positionsBelow) {
  return positionsBelow < pos2delete;
}