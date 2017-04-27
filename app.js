const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const util = require('util')
const request = require('request')
const pug = require('pug')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const port = process.env.PORT || 3000

const google_api_key = 'AIzaSyDuS3cbDdZ2Jrv2koZaEftyxD6aHcPNUss'
const google_client_id = '136034564686-g6jvbs2dih9op1jqvs8273f60gg0vp8h.apps.googleusercontent.com'
const google_client_secret = '7GG4_H7pTDxcXp-IwpGkOyt0'
const google_callback_url = 'http://127.0.0.1:3000/auth/google/callback'

const index = require('./index')
const app = express()

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})


passport.use(new GoogleStrategy({
  clientID: google_client_id,
  clientSecret: google_client_secret,
  callbackURL: google_callback_url,
  passReqToCallback: true
}, (request, accessToken, refreshToken, profile, done) => {
  process.nextTick(() => {
    let user = { accessToken: accessToken, userID: profile.id }
    return done(null, user)
  })
}))

app.set('view engine', 'pug')
app.set('views', 'views')
app.set('port', port)

app.use(express.static('./public'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'cookie_secret',
  name: 'conceptplayer',
  proxy: true,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  let buttonText = ''
  let button = ''
  let isLoggedin


  if (req.isAuthenticated()) {
    buttonText = 'Logout'
    button = '/logout'
    isLoggedin = true;
  } else {
    buttonText = 'Login'
    button = '/login'
    isLoggedin = false
  }

  res.render('index', {
    title: 'Concept Player',
    loginLogoutButton: buttonText,
    loginLogout: button,
    isLoggedin: isLoggedin
  })
})

app.get('/login', (req, res) => {
  res.redirect('/auth/google');
})

app.get('/auth/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/youtube'
  ]
}))

app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})

app.get('/search', (req, res) => {
  let query = req.query.q
  let url = '';
  url += 'https://www.googleapis.com/youtube/v3/search'
  url += '?part=snippet&videoEmbeddable=true&type=video&maxResults=25&q='
  url += query
  url += '&key=' + google_api_key

  request.get(url, (error, response) => {
    res.set('Content-Type', 'application/json')
    res.status(200)
    res.send(response.body)
  })
})

app.post('/createPlaylist', (req, res) => {

  if (req.isAuthenticated()) {
    let title = req.query.title
    let url = 'https://www.googleapis.com/youtube/v3/playlists'
    url += '?part=snippet&access_token='
    url += req.session.passport.user.accessToken
    let post = {
      "json": {
        "snippet": {
          "title": title
        }
      }
    }
    request.post(url, post, (error, response) => {
      res.status(200)
      res.set('Content-Type', 'application/json')
      res.send(response.body)
    })
  } else {
    res.status(401)
    res.send('Request requires authentication. Please <a href="login">login.</a>')
  }
})

app.delete('/deletePlaylist', (req, res) => {
  if (req.isAuthenticated()) {
    let id = req.query.id
    let url = 'https://www.googleapis.com/youtube/v3/playlists'
    url += '?id=' + id + '&access_token='
    url += req.session.passport.user.accessToken
    request.delete(url, {}, (error, response) => {
      res.status(response.statusCode)
      res.send(response)
    })
  } else {
    res.status(401)
    res.send('Request requires authentication. Please <a href="login">login.</a>')
  }
})

app.get('/getAllPlaylists', (req, res) => {
  let apiUrl = 'https://www.googleapis.com/youtube/v3/playlists'
  if (req.isAuthenticated()) {
    let url = "?part=snippet&mine=true&access_token=" +
      req.session.passport.user.accessToken + "&maxResults=50"
    request.get(apiUrl + url, (error, response) => {
      res.set('Content-Type', 'application/json')
      res.status(200).send(response.body)
    })
  } else {
    res.status(401)
      .send('Request requires authentication. Please <a href="login">login.</a>')
  }
})

app.get('/getSinglePlaylist', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.status(400)
      .send('Bad Request: Playlist ID required.')
  } else {
    let playlistId = req.query.playlistId
    let apiUrl = 'https://www.googleapis.com/youtube/v3/playlistItems'

    let url = apiUrl + "?part=snippet&maxResults=50&playlistId=" + playlistId

    if (req.isAuthenticated()) {
      url += '&access_token=' + req.session.passport.user.accessToken
    } else {
      url += '&key=' + google_api_key
    }
    request.get(url, (error, response) => {
      res.set('Content-Type', 'application/json')
      res.status(200).send(response.body)
    })
  }
})

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
