// Requires ffmpeg (brew install ffmpeg)
//          libmp3lame

const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

let url = 'https://www.youtube.com/watch?v=';

let downloadPlaylist = function(playlist, progressCb, doneCb) {
  let path = process.env.HOME + '/Music/ConceptPlayer'

  for (let video of playlist.items) {
    let inputStream = ytdl(url + video.videoId);

    if (!fs.existsSync(path + '/' + playlist.name))
      fs.mkdirSync(path + '/' + playlist.name)

    let outputStream = fs.createWriteStream(path + '/' + playlist.name + '/' +
      video.title + '.mp3');

    ffmpeg(inputStream)
      .audioCodec('libmp3lame')
      .audioBitrate(128)
      .format('mp3')
      .on('error', (err) => console.error(err))
      .on('end', () => {
        doneCb()
      })
      .pipe(outputStream, {
        end: true
      });
  }
}

exports.playlist = downloadPlaylist
