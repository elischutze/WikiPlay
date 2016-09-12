/* eslint-env jquery */
// const socket = io.connect('http://localhost:8000/')
// socket.on('connect', data => {
//   console.log('connected!');
// })


const pretty = (title, type) => {
  if (type === 'url') {
    return encodeURIComponent(title.replace(/'/g, ''))
  }
  return title.replace(/'/g, '').replace(/_/g, ' ').replace(/\\\\\\\'/g, '\'')
}

$(() => {
  console.log('ready!')

  $('#play-btn').click((event) => {
    $.ajax({
      url: 'http://localhost:8000/random',
      beforeSend: () => {
        $('.intro').fadeOut()
        $('#loading').show()
      },
      dataType: 'json',
      error: (xhr, status, err) => console.log(status, err),
      success: (data, status, xhr) => {
        // loadPage(data,status,xhr)
        loadFrame(data, status, xhr)
        console.log(status)
        console.log(data)
      },
    })
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

  $('#win-btn').click(() => {
    $('.iframe-holder').prepend($('<p>Congrats!</p>'))
  })
})

function loadFrame(data, status, xhr) {
  $('#loading').hide()
  $('#origin-title').html(pretty(data.origin))
  $('#target-title').html(pretty(data.target))
  // $('.iframe-holder h2').show()
  // $('.iframe-holder h3').show()
  $('.iframe-holder').show()
  // $('.frame')
  $('#frame1').attr({
    src: `https://en.m.wikipedia.org/wiki?title=${pretty(data.origin, 'url')}`,
    class: 'embed-responsive-item',
    sandbox: '',
  })
}

let server = '';
let username = '';

$('#username').submit(function (e) {
  e.preventDefault()
  server = io() // eslint-disable-line
  const $this = $(this)
  username = $this.find('input').val()
  console.log('form submitted with', username);
  server.emit('setName', username)

  $('#gamename').submit(function (event) {
    const gamename = $(this).find('input').val()
    event.preventDefault()
    console.log('game name:', gamename);
    server.emit('joinNewGame', username, gamename)
  })

  $('#existinggame').submit(function (event) {
    const findname = $(this).find('input').val()
    event.preventDefault()
    console.log('tryna join game:', findname);
    server.emit('joinGame', username, findname)
  })

  server.on('error', text => {
    console.log(text);
  })

  server.on('gameExists', () => {
    console.log('"game exists"');
  })
})
