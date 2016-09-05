/* eslint-env jquery */
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

// function loadPage(data,status,xhr){
//     let url = 'https://en.m.wikipedia.org/wiki?action=render&title='+encodeURIComponent(data.origin.replace(/\'/g,''))+'origin='+encodeURIComponent(window.location.origin)
//     $.ajax({
//         url: url,
//         dataType: 'html',
//         crossDomain: true,
//         success: function(data,status,xhr){
//             $('.test').html(data)

//         }
//     })

// }
