/* eslint-env jquery */

let PATH
let DONE = false
$(() => {
  console.log('ready!')

  $('#play-friends-btn').click(e => {
    $('.intro').fadeOut()
    $('#username').fadeIn()
  })

  // $('#play-btn').click((event) => {
  $.ajax({
    url: 'http://localhost:8000/random',
    beforeSend: () => {
      // $('.intro').fadeOut()
      // $('#loading').show()
    },
    dataType: 'json',
    error: (xhr, status, err) => console.log(status, err),
    success: (data, status, xhr) => {
      // loadPage(data,status,xhr)
      loadFrame(data, status, xhr)
      DONE = true
      console.log(status)
      console.log(data)
    }
  })
  // })

  $('#play-btn').click((event) => {
    $('.intro').fadeOut()
    if (!DONE) {
      $('#loading').show()
    } else {
      $('.iframe-holder').show()
    }

  })

  $('#frame1').on('load', () => {
    const counter = $('#counter')
    if (counter.html() === '') {
      counter.html('0')
    } else {
      const num = parseInt(counter.html(), 10) + 1
      counter.html(num)
    }
  })

  $('#newGameBtn').click(() => {
    $('.new-game-holder button').fadeOut()
    $('#gamename').fadeIn()
  })

  $('#joinGameBtn').click(() => {
    $('.new-game-holder button').fadeOut()
    $('#existinggame').fadeIn()
  })

  $('#win-btn').click(() => {
    $('.iframe-holder').prepend($('<h2>Congrats!</h2><br><h2>The best path is ' +
    PATH + ' clicks!</h2>'))
  })
})

// SOCKET LOGIC
let server = ''
let username = ''

$('#username').submit(function (e) {
  e.preventDefault()
  server = io() // eslint-disable-line
  const $this = $(this)
  username = $this.find('input').val()
  $('.user-holder').fadeIn().append('<li><i class="fa fa-user" aria-hidden="true"></i></li> ' + username)
  $this.fadeOut()
  $('.new-game-holder').fadeIn()
  console.log('form submitted with', username)
  server.emit('setName', username)

  $('#gamename').submit(function (event) {
    const gamename = $(this).find('input').val()
    event.preventDefault()
    console.log('game name:', gamename)
    server.emit('joinNewGame', username, gamename)
  })

  $('#existinggame').submit(function (event) {
    const findname = $(this).find('input').val()
    event.preventDefault()
    console.log('tryna join game:', findname)
    server.emit('joinGame', username, findname)
  })

  // server.on('userjoin', username => {
  //   console.log('user joined game:',username);
  //   $('.user-holder').append('<li><i class="fa fa-user" aria-hidden="true"></i> ' + username + '</li>')
  // })

  server.on('userjoin', players => {
    $('.user-holder').html('')
    for (var i = 0; i < players.length; i++) {
        $('.user-holder').append('<li><i class="fa fa-user" aria-hidden="true"></i> ' + players[i] + '</li>')
    }
  })

  server.on('error', text => {
    console.log(text)
  })

  server.on('gameExists', () => {
    console.log('"game exists"')
  })
})

function loadFrame (data, status, xhr) {
  $('#origin-title').html(pretty(data.origin.toString()))
  $('#target-title').html(pretty(data.target.toString()))
  $('#frame1').attr({
    src: `https://en.m.wikipedia.org/wiki?title=${pretty(data.origin, 'url')}`,
    class: 'embed-responsive-item',
    sandbox: ''
  })
  if($('#loading').is(":visible")){
    $('#loading').hide()
    // $('.iframe-holder h2').show()
    // $('.iframe-holder h3').show()
    $('.iframe-holder').show()
    // $('.frame')
  }
  PATH = data.path
}

function pretty (title, type) {
  if (type === 'url') {
    return encodeURIComponent(title.replace(/'/g, ''))
  }
  console.log(title);
  console.log(title.toString);
  return title.replace(/'/g, '').replace(/_/g, ' ').replace(/\\\\\\\'/g, '\'')
}
