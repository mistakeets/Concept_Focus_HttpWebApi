# Concept Focus: HTTP & Web APIs
(Project team ugly-plover)

To demonstrate an HTTP request-response cycle and web API interaction, our team created a video app that utilizes the YouTube API.
The web application has an embedded YouTube video player window, and the user has the ability to load playlists from their YouTube account.
The user also has the ability to create a new YouTube playlist and save the playlist to their Youtube account. 

In order for the user to access their playlists, Passport.js / Google OAuth2 is being used to handle the authentication process/token creation so the user can 
login to their Youtube account (which then grants the application permission to interact with the user's account). An Express server process
is used to interact with the API / handle routes and HTTP Requests/Responses. 

In order for the user to create new playlists, our app also has a search feature so that the user can search YouTube for videos and add them to a new playlist. 
Using the Google/YouTube API, the newly created playlist is then sent back to YouTube, and the playlist is saved in the user's YouTube account. 

## Examples of HTTP verb usage

These HTTP verbs are used in our project routes (app.js)

GET /   
Host: 127.0.0.1:3000
(Loads main app)

POST /download/playlist
Host: 127.0.0.1:3000
query: name (name of playlist)
{
  items: array[{
    videoId: '',
    title: ''
  }]
}
(downloads a playlist from YouTube)

PUT /updatePlaylistName
Host: 127.0.0.1:3000
queries: title, id
{}

DELETE /deleteFromPlaylist
Host: 127.0.0.1:3000
query: id
{}

## Examples of status code usage

GET /search
Host: 127.0.0.1:3000
**Response**
Status Code 200
Json object (search results)

POST /createPlaylist
Host: 127.0.0.1:3000
**Response**
Status Code 201
Json object (playlist)

GET /getSinglePlaylist
Host: 127.0.0.1:3000
Authenication None
**Response**
Status Code 400
Bad Request: Playlist ID Required

GET /oldPage
Host: 127.0.0.1:3000
**Response**
Status Code 301
This page has been moved permanently
HEADER location: /

GET /admin
Host: 127.0.0.1:3000
**Response**
Status Code 403
Forbidden

GET /someRandomPage
Host: 127.0.0.1:3000
**Response**
Status Code 404
File not found

GET /delete-all
Host: 127.0.0.1:3000
**Response**
Status Code 500
Internal Server Error

## Examples of routing and query string usage

http://127.0.0.1:3000/getSinglePlaylist?playlistId=PLWSrXE0yCvMMcpgAxwMyDLqoqOu7W11sP 

http://127.0.0.1:3000/search?q=soup

## Examples of each request header
Accept Request header:

DELETE /deleteFromPlaylist?id=UEx5QVRsaEY0a2lGMDFWWEJtZE9GYWJ4cnZNa0pVd3hMVS5GM0Q3M0MzMzY5NTJFNTdE HTTP/1.1
Host: 127.0.0.1:3000
Connection: keep-alive
accept: application/json
Origin: http://127.0.0.1:3000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36
Referer: http://127.0.0.1:3000/
Accept-Encoding: gzip, deflate, sdch, br
Accept-Language: en-US,en;q=0.8
Cookie: conceptplayer=s%3AXyNLqQ2RlTkagCYxkFg_dk6i92EcfeuM.buA7IwWoUfgoiqN3OQRp7HDNM%2F%2FIH1EfE3qhKr7Ql%2BQ

Origin/Content/Cookie Request type header example:

POST /download/playlist?name=singles HTTP/1.1
Host: 127.0.0.1:3000
Connection: keep-alive
Content-Length: 59
Origin: http://127.0.0.1:3000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36
content-type: application/json
Accept: */*
Referer: http://127.0.0.1:3000/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.8
Cookie: conceptplayer=s%3AXyNLqQ2RlTkagCYxkFg_dk6i92EcfeuM.buA7IwWoUfgoiqN3OQRp7HDNM%2F%2FIH1EfE3qhKr7Ql%2BQ

Authorization usage examples: 

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.delete('/deleteFromPlaylist', (req, res) => {
  if (req.isAuthenticated()) {
    let id = req.query.id;
    let url = 'https://www.googleapis.com/youtube/v3/playlistItems'
    url += '?id=' + id
    url += '&access_token=' + req.session.passport.user.accessToken

## Examples of each response header

Location response header usage example:
app.get('/oldPage', (req, res) => {
  res.status(301)
  res.set('Location', '/')
  res.send('This page has been moved FOREVER!')
})

Set-Cookie example:
Cookie: conceptplayer=s%3AXyNLqQ2RlTkagCYxkFg_dk6i92EcfeuM.buA7IwWoUfgoiqN3OQRp7HDNM%2F%2FIH1EfE3qhKr7Ql%2BQ

Content-Length:21993
Content-Type:application/json; charset=utf-8
Date:Fri, 28 Apr 2017 21:24:55 GMT
ETag:W/"55e9-9Vq4arW2LOkOwWZSSrQW/R09ZpI"
X-Powered-By:Express
Request Headers
Provisional headers are shown
accept:application/json
Referer:http://127.0.0.1:3000/
User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36

## Examples of each request type to the external API 
Search query example: 
GET https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&q=country

Create playlist with title:
POST https://www.googleapis.com/youtube/v3/playlists?part=snippet&access_token=
{
  "json": {
    "snippet": {
      "title": "playlist-title"
    }
  }
}

Update Playlist Name (put request to external API):
app.put('/updatePlaylistName', (req, res) => {
  if (req.isAuthenticated()) {
    let id = req.query.id
    let title = req.query.title
    let url = 'https://www.googleapis.com/youtube/v3/playlists'
    url += '?part=snippet&access_token='
    url += req.session.passport.user.accessToken
    let body = {
      "json": {
        "id": id,
        "snippet": {
          "title": title
        }
      }
    }

Delete playlist (example of a delete request to the external API)
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



## Challenge Rating

This goal will likely be within your ZPD if you...

- Can choose a goal that fits your ZPD
- Have set up a web server with Node.js and Express
- Are familiar with the concept of web servers and clients
- Are comfortable jumping into a new codebase
- Are interested in learning more about HTTP
- Are interested in learning more about how the web works
- Are interested in working with web APIs

## Description

Explore the inner workings of **HTTP**, and apply your knowledge to interact with an external **web API**.

_Concept focus_ goals like this one have some unique characteristics. If this is your first time working on one, read the [Context](#context) for more information.

In working on this goal, you should explore concepts like:

- The HTTP request-response cycle
- HTTP verbs
- URL components: host, path, query string
- Routing web requests
- Serving static resources
- Interacting with an external web API

For guidance and support, start with the [Resources](#resources) provided.

## Context

This goal is a _concept focus_ goal, which means that it is not specific about the project you build, but rather the concepts that you apply in building it.

You will have to choose _what to build_. The details of the project are up to you. The project can be pre-written (so long as you have permission to use it) or a new one of your own choosing. You can even choose projects from other goals.

For inspiration, review the [list of project ideas][project-ideas].

The advantage of this is that you can work on whatever kind of project you like, so long as you focus on building your skills and knowledge of the concept in question.

The disadvantage is that it is very easy to get distracted or to waste time on non-essential tasks like making decisions about project design. It is also likely that you won't have as much support available, since other learners and coaches won't have worked on the same project as you. If you prefer to have more structure and deterministic outcomes, you may not enjoy this goal.

That being said, if you have the self-discipline, motivation, and resolve, you will likely benefit from choosing this goal.

An added benefit of working on a concept-focus goal is that you'll have a project with lots of great _examples_ that you can reference later.

## Specifications

- [x] Artifact produced is a GitHub repo.
- [x] GitHub repo contains a web server.
- [x] Can run the command `npm start` to start the web server at port 3000.
- [x] The web server source code is written using the [Express][express] library.
- [x] The web server handles routes for the following HTTP verbs
  - [x] `GET`
  - [x] `POST`
  - [x] `PUT/PATCH`
  - [x] `DELETE`
- [x] Examples of each HTTP verb usage are listed and linked to in the README
- [x] The web server makes use of the following response status codes
  - [x] `200` (OK)
  - [x] `201` (Created)
  - [x] `400` (Bad Request)
  - [x] `401` (Unauthorized) ** Note: our team added 401 to this list ** 
  - [x] `301` (Moved Permanently)
  - [x] `403` (Forbidden)
  - [x] `404` (Not Found)
  - [x] `500` (Internal Server Error)
- [x] Examples of each status code usage are listed and linked to in the README
- [x] The web server uses URL components in routing and responding
  - [x] Different paths trigger different routes
  - [x] Values from the URL query string are used in a route
- [x] Examples of routing and query string usage are listed and linked to in the README
- [x] The web server makes use of the following request headers
  - [x] `Accept`
  - [x] `Origin`
  - [x] `Content Type`
  - [x] `Authorization` 
  - [x] `Cookie`
- [x] Examples of each request header usage are listed and linked to in the README
- [x] The web server makes use of the following response headers
  - [x] `Location`
  - [x] `Set-Cookie`
  - [ ] `Refresh`
  - [ ] `Access-Control-Allow-Origin`
  - [ ] `Content-Length`
- [x] Examples of each response header usage are listed and linked to in the README
- [x] The web server serves different types of resources
  - [x] Asset files (CSS, images)
  - [x] Static HTML
  - [x] Static JSON
  - [x] Dynamic resources (content of response changes based on query params, request headers, and/or application state)
- [x] Examples of each response type are listed and linked to in the README
- [x] Example of a raw HTTP request and the server's raw HTTP response are included in the README
  - [x] Examples show full HTTP message header
  - [x] Examples show full HTTP message body
- [x] The web server makes the following request types to an external API
  - [x] Get a resource
  - [x] Create a resource
  - [x] Update a resource
  - [x] Delete a resource
- [x] Examples of each request type to the external API are listed and linked to in the README
- [x] The best resources you find for learning testing are added to a file `resources.md`
- [x] The artifact produced is properly licensed, preferably with the [MIT license][mit-license]

## Stretch

- [ ] Web server is written using _only the core Node.js modules_ (instead of Express, use the built-in [HTTP module][node-http])
- [ ] Web server uses OAuth to authenticate with the external API
- [ ] OAuth routes are listed and linked to in the README
- [ ] The web server exposes a JSON API at `/api`
  - [ ] API supports all CRUD actions for a resource (Create, Read, Update, Delete)
  - [ ] API follows a the RESTful design convention
  - [ ] API doesn't use database persistence (an in-memory store is fine)
- [ ] Basic documentation for the API and each route is included in the README

## Resources

### Courses, Tutorials, Articles

- Treehouse course on [HTTP Basics][treehouse-http] (67-minute Development Tools Course)
- [Overview of HTTP][ntu-http-overview] from NTU Singapore
- [Tips on HTTP][tutsplus-http] from Tuts+
- [Beginner's Guide to HTTP and REST][tutsplus-http-rest] from Tuts+
- Mozilla Developer Network's [Guide to HTTP][mdn-http]
- 30 min course on the [Basics of HTTP][egghead-http-basics]
- Article on [How the Web Works](https://medium.freecodecamp.com/how-the-web-works-a-primer-for-newcomers-to-web-development-or-anyone-really-b4584e63585c#.3l2bffw28)

### Tools

- [Postman][postman-extension] is a nice GUI for building HTTP requests
- [curl][curl] is a super useful tool for making HTTP requests from the command line

[mit-license]: https://opensource.org/licenses/MIT
[project-ideas]: {{ site.url }}{% link project-ideas.md %}

[express]: http://expressjs.com/
[node-http]: https://nodejs.org/api/http.html


[treehouse-http]: https://teamtreehouse.com/library/http-basics
[ntu-http-overview]: https://www.ntu.edu.sg/home/ehchua/programming/webprogramming/HTTP_Basics.html
[tutsplus-http]: https://code.tutsplus.com/tutorials/http-the-protocol-every-web-developer-must-know-part-1--net-31177
[tutsplus-http-rest]: https://code.tutsplus.com/tutorials/a-beginners-guide-to-http-and-rest--net-16340
[curl]: https://curl.haxx.se/
[mdn-http]: https://developer.mozilla.org/en-US/docs/Web/HTTP
[egghead-http-basics]: https://egghead.io/courses/understand-the-basics-of-http
[postman-extension]: https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en
