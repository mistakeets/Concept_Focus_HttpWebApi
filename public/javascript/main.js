let player = {}
let playlist = {
  id: '',
  title: ''
}

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

let addToPlaylist = function() {

  $('.add-to-playlist').prop('disabled', true)
  setTimeout(() => {
    $('.add-to-playlist').prop('disabled', false)
  }, 2000)
  let playlistId = playlist.id
  let videoId = player.videoId
  let body = {
    'playlistId': playlistId,
    'videoId': videoId
  }
  fetch('addToPlaylist', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((response) => {
    return response.json()
  })
  .then((response) => {
    setTimeout(() => {
      populatePlaylist(playlist.id, playlist.title)
    }, 500)
  })
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
      populatePlaylist(response.id, response.snippet.title)
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
        populatePlaylist('PLyATlhF4kiF01VXBmdOFabxrvMkJUwxLU', 'Playlist')
      })
      .catch(console.log)
  }
}

let updatePlaylistName = function(id) {
  let newTitle = prompt('Enter new playlist name')
  fetch('updatePlaylistName?id=' + id + '&title=' + newTitle, {
      method: 'PUT',
      credentials: 'include'
    })
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      $('.playlist-title').html(newTitle)
      populateAllPlaylists()
    })
    .catch(console.log)
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
      html += '\', \'' + item.snippet.title + '\')">'
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
let populatePlaylist = function(playlistId, title) {
  getPlaylist(playlistId, (response) => {
    $('.playlist').html(' ');
    for (let item of response.items) {
      $('.playlist').append('<li class="list-group-item">' +
        '<a href="javascript:;"' +
        ' onclick="playVideo(\'' + item.snippet.resourceId.videoId +
        '\')">' + item.snippet.title + '</a></li>')
    }

    playlist.id = playlistId
    playlist.title = title

    $('.playlist-title').html(title)
    $('.edit').attr('onclick', 'updatePlaylistName("' +
      playlistId + '")')
    $('.delete-button').attr('onclick', 'deletePlaylist("' +
      playlistId + '")')
  })
}

let playVideo = function(videoId) {
  player.videoId = videoId
  player.loadVideoById(videoId)
}

$('document').ready(function() {
  $('.search').on('keypress', (event) => {
    if (event.keyCode === 13)
      populateSearchResults($('.search').val())
  })
  $('.add-to-playlist').on('click', addToPlaylist)
})
