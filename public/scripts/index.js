/* eslint-env jquery */

// GLOBAL VARS
let PATH, ROUND, GROUP, SOCKET
let DONE = false
let server = ''
let username = ''
let gamename = ''
newRound()

// DOCUMENT READY
$(() => {
  console.log('ready!')

  // IFRAME ONLOAD EVENT CLICK COUNTER


  // SOLO PLAY BUTTON CLICK EVENT
  $('#play-btn').click((event) => {
    $('.intro').fadeOut()
    if (!DONE) {
      $('#loading').show()
    } else {
      $('.iframe-holder').show()
    }

  })

  // FRIENDS PLAY BUTTON CLICK EVENT
  $('#play-friends-btn').click(e => {
    $('.intro').fadeOut()
    $('#username').fadeIn()
    GROUP = true
  })

  // DECIDE TO MAKE NEW GAME ROOM
  $('#newGameBtn').click(() => {
    $('.new-game-holder button').fadeOut()
    $('#gamename').fadeIn()
  })

  // JOIN EXISTING GAME ROOM
  $('#joinGameBtn').click(() => {
    $('.new-game-holder button').fadeOut()
    $('#existinggame').fadeIn()
  })

  // WHEN YOU WIN
  $('#win-btn').click(() => {
    $('.iframe-holder').prepend($('<h2>Congrats!</h2><br><h2>The best path is ' +
    PATH + ' clicks!</h2>'))
  })
})

/*
SOCKET LOGIC
- message reception
- game room form submissions

*/


// NEW USER
$('#username').submit(function (e) {
  e.preventDefault()
  server = io() // eslint-disable-line
  SOCKET = server
  const $this = $(this)
  username = $this.find('input').val()
  $('.user-holder').fadeIn().append('<li><i class="fa fa-user" aria-hidden="true"></i></li> ' + username)
  $this.fadeOut()
  $('.new-game-holder').fadeIn()
  console.log('form submitted with', username)
  server.emit('setName', username)

  // NEW GAME ROOM NAME FORM
  $('#gamename').submit(function (event) {
    // Variables
    gamename = $(this).find('input').val()
    // Prep
    $('.warning').hide()
    event.preventDefault()
    // Socket
    server.emit('joinNewGame', username, gamename)
    // DOM
    // $('#loading').show()
    $('input[type="text"]', this).val('')
    $('.new-game-holder').fadeOut()
    $(this).fadeOut()
    if (!DONE) {
      $('#loading').show()
    } else {
      server.emit('setNewRound', ROUND, gamename)
      $('.iframe-holder').show()
    }

    // loadFrame(ROUND)
  })

  // JOIN EXISTING GAME ROOM FORM
  $('#existinggame').submit(function (event) {
    // Variables
    const findname = $(this).find('input').val()
    // Prep
    event.preventDefault()
    ROUND = ''
    // Socket
    server.emit('joinGame', username, findname)
    if (!$('.warning').is(':visible')) {
      gamename = findname
      server.emit('getRound', findname)
      // DOM
      $('#loading').show()
      $('input[type="text"]', this).val('')
      $(this).fadeOut()
      $('.new-game-holder').fadeOut()
    }
  })

  // USER HAS JOINED ROOM, emmitted to all room players
  server.on('userjoin', players => {
    $('.user-holder').html('')
    for (var i = 0; i < Object.keys(players).length; i++) {
      $('.user-holder').append(`<li id="${Object.keys(players)[i]}"><i class="fa fa-user" aria-hidden="true"></i><br>
       ${Object.keys(players)[i]}<br><span class="score">${players[Object.keys(players)[i]]}</span></li>`)
    }
  })

  // INCOMING SOCKET MESSAGE HANDLERS
  server.on('newRound', round => {
    ROUND = round
    loadFrame(round)
  })

  server.on('room', room => {
    $('.game-name-holder').html(room).show()
  })
  // Error log message
  server.on('error', text => {
    console.log(text)
  })

  // Game already exists
  server.on('gameExists', () => {
    console.log('"game exists"')
  })

  // Player tried to join game that doesn't exist
  server.on('game-doesnt-exist', err => {
    $('.new-game-holder').prepend(`<p class="warning">${err}</p>`)
    $('.loading').hide()
  })

  server.on('increment', (name, num) => {
    $('#' + name + ' .score').html(num)
  })
})

/*
HELPER FUNCTIONS
*/
// $('#play-btn').click((event) => {
function newRound () {
  $.ajax({
    url: 'http://localhost:8000/random',
    beforeSend: () => {
      // $('.intro').fadeOut()
      // $('#loading').show()
    },
    dataType: 'json',
    error: (xhr, status, err) => console.log(status, err),
    success: (data, status, xhr) => {
      loadFrame(data)
      ROUND = data
      DONE = true
      console.log(status)
      console.log(data)
    }
  })
}
function loadFrame (data) {
  $('#origin-title').html(pretty(data.origin.toString()))
  $('#target-title').html(pretty(data.target.toString()))
  $('#frame1').remove()
  const counter = $('#counter')
  counter.html('')
  let $iframe = $('<iframe>',
  { id: 'frame1',
  class: 'embed-responsive-item',
  sandbox: ''
}).on('load', () => {
  console.log('on load')
  if (counter.html() === '') {
    counter.html('0')
  } else {
    const num = parseInt(counter.html(), 10) + 1
    counter.html(num)
    $('#' + username + ' .score').html(num)
    if (GROUP) {
      SOCKET.emit('increment counter', num, gamename)
    }
  }
}).attr('src', `https://en.m.wikipedia.org/wiki?title=${pretty(data.origin, 'url')}`)

  // show iframe
  $iframe.appendTo($('.iframe-holder'))
  if ($('#loading').is(':visible')) {
    $('#loading').hide()
    $('.iframe-holder').show()
  }
  PATH = data.path
}
function pretty (title, type) {
  if (type === 'url') {
    return encodeURIComponent(title.replace(/'/g, ''))
  }
  return title.replace(/'/g, '').replace(/_/g, ' ').replace(/\\\\\\\'/g, '\'')
}
