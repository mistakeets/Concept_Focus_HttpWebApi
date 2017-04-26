const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const util = require('util')
const request = require('request')

const session = require('express-session')

const GoogleStrategy = require('passport-google-oauth2').Strategy;

const port = process.env.PORT || 3000

const google_client_id = '136034564686-g6jvbs2dih9op1jqvs8273f60gg0vp8h.apps.googleusercontent.com'
const google_client_secret = '7GG4_H7pTDxcXp-IwpGkOyt0'
const google_callback_url = 'http://127.0.0.1:3000/auth/google/callback'
const playlistApiUrl = 'https://www.googleapis.com/youtube/v3/playlists'
const playlistItemUrl = 'https://www.googleapis.com/youtube/v3/playlistItems'

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
app.set('views', './views')
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
  if (req.isAuthenticated()) {
    res.send("User is authenticated!!" + JSON.stringify(req.session.passport.user))
  } else {
    res.send("User is not logged in :(")
  }
})

app.get('/login', (req, res) => {
  res.redirect('/auth/google');
})

app.get('/auth/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/youtube.readonly'
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

//TODO: auth user for these get playlist methods

app.get('/getAllPlaylists', (req, res) => {
  let url = "?part=snippet&mine=true&access_token=" +
    req.session.passport.user.accessToken
  request.get(playlistApiUrl + url)
    .on('response', (response) => {
      res.set('Content-Type', 'application/json')
      res.status(200).send(response)
    })
})

app.get('/getSinglePlaylist', (req, res) => {
  let playlistId = req.query.playlistId
  let url = "?part=snippet&playlistId=" + playlistId + "&access_token=" +
    req.session.passport.user.accessToken
  request.get(playlistItemUrl + url)
    .on('response', (response) => {
      res.set('Content-Type', 'application/json')
      res.status(200).send(response)
    })
})


app.listen(port, () => {
  console.log('Listening on port ' + port)
})
