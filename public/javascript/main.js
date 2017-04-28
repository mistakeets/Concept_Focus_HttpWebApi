let player = {}

let currentVideo = {
  downloaded: false
}

let playlist = {
  id: '',
  title: '',
  downloaded: false,
  items: []
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
  populatePlaylist('PLyATlhF4kiF01VXBmdOFabxrvMkJUwxLU', 'Playlist')
}

let downloadSong = function () {
  if(!currentVideo.downloaded) {
    currentVideo.downloaded = true
    $('.download-song').attr('class', 'btn btn-warning download-song')

    let body = {
      items: [
        {
          videoId: player.videoId,
          title: player.videoId
        }
      ]
    }

    fetch('download/playlist?name=singles', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((response) => {
      return response
    })
    .then((response) => {
      $('.download-song').attr('class', 'btn btn-success download-song')
    })
    .catch(console.log)

  }
}

let downloadPlaylist = function() {
  if(!playlist.downloaded) {
    playlist.downloaded = true
    $('.download-button').attr('class', 'btn btn-warning btn-sm download-button')
    let body = {
      items: playlist.items
    }
    fetch('download/playlist?name=' + playlist.title, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((response) => {
      return response
    })
    .then((response) => {
      if(response.status == 201) {
        $('.download-button').attr('class', 'btn btn-success btn-sm download-button')
      }
    })
    .catch(console.log)
  }
}

let deleteVideo = function(videoId) {
  fetch('deleteFromPlaylist?id=' + videoId, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
    }
  })
  .then((response) => {
    return response
  })
  .then((response) => {
    if(response.status === 204) {
      $('.' + videoId).slideUp('fast', function () {
        $(this).remove()
      })
    }
  })
  .catch(console.log)
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

    playlist.id = playlistId
    playlist.title = title.replace(/[^\w]/gi, '')
    playlist.items = []
    playlist.downloaded = false
    $('.download-button').attr('class', 'btn btn-info btn-sm download-button')

    for (let item of response.items) {

      let safeTitle = item.snippet.title.replace(/[^\w]/gi, '')
      playlist.items.push({
        videoId: item.snippet.resourceId.videoId,
        title: safeTitle
      })

      let videoId = item.snippet.resourceId.videoId
      let html = '' +
        '<li class="list-group-item d-inline-block ' + item.id + '">' +
          '<a class="float-left" href="javascript:;" onclick="playVideo(\'' +
            videoId + '\')">' +
            item.snippet.title +
          '</a>'

      if(window.loggedIn) {
        html = html +
          '<a class="float-right delete-video" ' +
            'href="javascript:;" onclick="deleteVideo(\'' +
            item.id + '\')">' +
            '<i class="fa fa-minus-circle"> </i>' +
          '</a>'
      }
      html = html +
        '</li>'
      $('.playlist').append(html)
    }

    $('.playlist-title').html(title)
    $('.edit').attr('onclick', 'updatePlaylistName("' +
      playlistId + '")')
    $('.delete-button').attr('onclick', 'deletePlaylist("' +
      playlistId + '")')
  })
}

let playVideo = function(videoId) {
  player.videoId = videoId
  $('.download-song').attr('class', 'btn btn-primary download-song')
  currentVideo.downloaded = false
  player.loadVideoById(videoId)
}

$('document').ready(function() {
  $('.search').on('keypress', (event) => {
    if (event.keyCode === 13)
      populateSearchResults($('.search').val())
  })
  $('.add-to-playlist').on('click', addToPlaylist)
  $('.download-button').on('click', downloadPlaylist)
  $('.download-song').on('click', downloadSong)
})
