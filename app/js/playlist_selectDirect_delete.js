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
  var removeOldPlaylist = document.getElementsByClassName("trackResult");
  if (removeOldPlaylist.length > 0) {
    for (var l = removeOldPlaylist.length - 1; l >= 0; l--) {
      removeOldPlaylist[l].parentNode.removeChild(removeOldPlaylist[l]);
    }
  }
  var responseString = JSON.stringify(response, '', 2);
  document.getElementById('response').innerHTML += responseString;
  for (var i = 0; i < response.items.length; i++) {
    var trackResultElement = document.createElement("div");
    trackResultElement.className = "trackResult";
    trackResultElement.id = i;
    var paragraphTrack = document.createElement("p");
    var detailsTrack = document.createElement("details");
    catchSearchByKeywordTitle[i] = response.items[i].snippet.title;
    catchSearchByKeywordDesc[i] = response.items[i].snippet.description;
    catchSearchByKeywordId[i] = response.items[i].id.videoId;
    paragraphTrack.innerHTML = catchSearchByKeywordTitle[i];
    detailsTrack.innerHTML = catchSearchByKeywordDesc[i];
    trackResultElement.addEventListener("click", function selectByButton() {
      videoListIds.push(catchSearchByKeywordId[this.id]);
      addInfo2Playlist(this.id);
      displayPlaylist();
    });
    trackResultElement.appendChild(paragraphTrack);
    trackResultElement.appendChild(detailsTrack);
    document.getElementById("searchResults").appendChild(trackResultElement);
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
  var removeOldPlaylist = document.getElementsByClassName("trackSelector");
  if (removeOldPlaylist.length > 0) {
    for (var l = removeOldPlaylist.length - 1; l >= 0; l--) {
      removeOldPlaylist[l].parentNode.removeChild(removeOldPlaylist[l]);
    }
  }
  for(var k = 0; k < add2PlaylistInfo.length; k++) {
    var para = document.createElement("p");
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
    var btn = document.createElement("BUTTON");
    btn.id = "btnDelete" + k;
    btn.catchPosition = k;
    var text = document.createTextNode("Delete video");
    btn.appendChild(text);
    btn.addEventListener("click", function deleteVideo() {
      pos2delete = parseInt(this.catchPosition);
      videoListIds.splice(pos2delete, 1);
      add2PlaylistInfo.splice(pos2delete, 1);
      countDeleted++;
      displayPlaylist();
    });
    var divCont = document.createElement("div");
    divCont.className = "trackSelector";
    divCont.appendChild(para);
    divCont.appendChild(btn);
    document.getElementById("dispPlaylistContainer").appendChild(divCont);
  }
}

function lower2Delete (positionsBelow) {
  return positionsBelow < pos2delete;
}