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
let populatePlaylist = function (playlistId) {
  getPlaylist(playlistId, (response) => {
    for(let item of response.items) {
      $('.playlist').append('<li class="list-group-item"><a class="' +
        item.snippet.resourceId.videoId + '" href="javascript:;">' +
        item.snippet.title + '</a></li>')
    }
  })
}

$('document').ready(function () {
  populatePlaylist('PLyATlhF4kiF01VXBmdOFabxrvMkJUwxLU')
})
