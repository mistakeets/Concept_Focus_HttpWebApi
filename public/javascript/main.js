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

let getAllPlaylists = function(callback) {
  let json = {}
  fetch('/getAllPlaylists', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then((response) => {
    return response.json()
  })
  .then(callback)
  .catch(console.log)
}

let populateAllPlaylists = function() {
  getAllPlaylists((response) => {
    for(let item of response.items) {
      let html = ''
      html += '<a href="#" class="dropdown-item" onclick="populatePlaylist(\''
      html += item.id
      html += '\')">'
      html += item.snippet.title
      html += '</a>'
      $('.list-of-playlists').append(html)
    }
  })
}

let getPlaylist = function(playlistId, callback) {
  let json = {}
  fetch('/getSinglePlaylist?playlistId=' + playlistId, {
      method: 'GET',
      credentials: 'include',
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
    if(response.items.length > 0)
      playVideo(response.items[0].snippet.resourceId.videoId)
    $('.playlist').html(' ');
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
