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

let createPlaylist = function() {
  query = prompt("Enter playlist name")
  fetch('createPlaylist?title=' + query, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      populatePlaylist(response.id)
      populateAllPlaylists()
    })
}

let deletePlaylist = function(id) {
  if (confirm("Are you sure you want to delete this playlist?")) {
    fetch('deletePlaylist?id=' + id, {
        method: 'DELETE',
        credentials: 'include'
      })
      .then((response) => {
        return response.text()
      })
      .then((response) => {
        populateAllPlaylists()
        populatePlaylist('PLyATlhF4kiF01VXBmdOFabxrvMkJUwxLU')
      })
      .catch(console.log)
  }
}

let getSearchResults = function(query, callback) {
  fetch('search?q=' + query, {
      method: 'GET',
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

let populateSearchResults = function(query) {
  getSearchResults(query, (response) => {
    $('.search-results').html('')
    for (let item of response.items) {
      let html = ''
      html += '<div class="card search-item" onclick="playVideo(\''
      html += item.id.videoId + '\')">'
      html += '<img class="img-thumbnail img-fluid" src="'
      html += item.snippet.thumbnails.default.url + '">'
      html += '<div class="card-block"><p class="card-text">'
      html += item.snippet.title + '</p></div>'
      html += '</div>'
      $('.search-results').append(html)
    }
  })
}

let getAllPlaylists = function(callback) {
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
    $('.list-of-playlists').html('');
    for (let item of response.items) {
      let html = ''
      html += '<a href="#" class="dropdown-item" onclick="populatePlaylist(\''
      html += item.id
      html += '\')">'
      html += item.snippet.title
      html += '</a>'
      $('.list-of-playlists').append(html)
    }
    let html = ''
    html += '<a href="#" class="dropdown-item new-playlist" '
    html += 'onclick="createPlaylist()"><b>New Playlist</b>'
    html += '</a>'
    $('.list-of-playlists').append(html)
  })
}

let getPlaylist = function(playlistId, callback) {
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
    if (response.items.length > 0)
      playVideo(response.items[0].snippet.resourceId.videoId)
    $('.playlist').html(' ');
    for (let item of response.items) {
      $('.playlist').append('<li class="list-group-item">' +
        '<a href="javascript:;"' +
        ' onclick="playVideo(\'' + item.snippet.resourceId.videoId +
        '\')">' + item.snippet.title + '</a></li>')
    }
    $('.delete-button').attr('onclick', 'deletePlaylist("' +
      playlistId + '")')
  })
}

let playVideo = function(videoId) {
  player.loadVideoById(videoId)
}

$('document').ready(function() {
  $('.search').on('keypress', (event) => {
    if (event.keyCode === 13)
      populateSearchResults($('.search').val())
  })
})
