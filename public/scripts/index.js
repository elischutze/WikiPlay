/* eslint-env jquery */
$(() => {
  console.log('ready!');

  $('#play-btn').click((event) => {
    $.ajax({
      url: 'http://localhost:8000/random',
      beforeSend: () => {
        $('.intro').fadeOut();
        $('#loading').show();
      },
      dataType: 'json',
      error: (xhr, status, err) => console.log(status, err),
      success: (data, status, xhr) => {
        // loadPage(data,status,xhr);
        loadFrame(data, status, xhr);
        console.log(status);
        console.log(data);
      },
    });
  });
});
function loadFrame(data, status, xhr) {
  $('#loading').hide();
  $('#origin-title').html(pretty(data.origin));
  $('#target-title').html(pretty(data.target));
  $('.iframe-holder h2').show();
  // $('.frame')
  $('<iframe>', {
    src: `https://en.m.wikipedia.org/wiki/${pretty(data.origin, 'url')}`,
    id: 'frame1',
    frameborder: 0,
    scrolling: 'no',
    sandbox: 'allow-scripts',
  }).appendTo('.iframe-holder');
}

function pretty(title, type) {
  if (type === 'url') {
    return encodeURIComponent(title.replace(/'/g, ''));
  }
  return title.replace(/'/g, '').replace(/_/g, ' ').replace(/\\\'/g,'\'');
}

// function loadPage(data,status,xhr){
//     let url = 'https://en.m.wikipedia.org/wiki?action=render&title='+encodeURIComponent(data.origin.replace(/\'/g,''))+'origin='+encodeURIComponent(window.location.origin);
//     $.ajax({
//         url: url,
//         dataType: 'html',
//         crossDomain: true,
//         success: function(data,status,xhr){
//             $('.test').html(data);

//         }
//     });

// }
