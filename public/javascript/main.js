let player = {}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    width: '100%',
    height: '75%',
    // videoId: '',
    events: {
      'onReady': onPlayerReady
    }
  })
}

function onPlayerReady(event) {
  populatePlaylist('PLyATlhF4kiF01VXBmdOFabxrvMkJUwxLU')
}



let getPlaylist = function(playlistId, callback) {
  let json = {}
  fetch('/getSinglePlaylist?playlistId=' + playlistId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      return response.json();
    })
    .then(callback)
    .catch(console.log)
}
let populatePlaylist = function(playlistId) {
  getPlaylist(playlistId, (response) => {
    playVideo(response.items[0].snippet.resourceId.videoId)
    for (let item of response.items) {
      $('.playlist').append('<li class="list-group-item">' +
        '<a href="javascript:;"' +
        ' onclick="playVideo(\'' + item.snippet.resourceId.videoId +
        '\')">' + item.snippet.title + '</a></li>')
    }
  })
}

let playVideo = function(videoId) {
  player.loadVideoById(videoId)
}

$('document').ready(function() {

})
