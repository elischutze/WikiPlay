$(function() {
    console.log( "ready!" );

    $("#play-btn").click(function(event){

        $.ajax({
            url:"http://localhost:8000/random",
            beforeSend:function(){
                $(".intro").fadeOut();
                $("#loading").show();
            },
            dataType: 'json',

            error:function(xhr,status,err){ console.log(status,err);},
            success:
            function(data,status,xhr){

                // loadPage(data,status,xhr);
                loadFrame(data,status,xhr);
                console.log(status);
                console.log(data);
            }


        });

    });

});
function loadFrame(data,status,xhr){

    $("#loading").hide();



        $('<iframe>', {
           src: "https://en.m.wikipedia.org/wiki/"+encodeURIComponent(data.origin.replace(/\'/g,"")),
           id:  'frame1',
           frameborder: 0,
           scrolling: 'no',sandbox: ""
           }).appendTo('.iframe-holder');
}

// function loadPage(data,status,xhr){
//     let url = "https://en.m.wikipedia.org/wiki?action=render&title="+encodeURIComponent(data.origin.replace(/\'/g,""))+"origin="+encodeURIComponent(window.location.origin);
//     $.ajax({
//         url: url,
//         dataType: 'html',
//         crossDomain: true,
//         success: function(data,status,xhr){
//             $(".test").html(data);

//         }
//     });

}