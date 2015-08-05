var test;
var global_result = null;

//https://itunes.apple.com/us/rss/topsongs/limit=10/genre=1007/json
//https://itunes.apple.com/us/rss/topalbums/limit=10/genre=1007/json

$(document).ready(function() {
    $(".dummyLayout").hide();
    //Make the dropdown items have indices which sync up to this array
    var searchParams =[
        {genre: },
        {},
        {}
    ]

    $("#getHits").click(function () {
        $.ajax({
            dataType: 'json',
            url: 'https://itunes.apple.com/us/rss/topsongs/limit=20/genre=1007/json',
            success: function (result) {
                console.log('loaded', result);
                global_result = result;
                var musicFind = global_result.feed.entry;
                var musicLength = musicFind.length;
                var $body = $("body");
                for (var i = 0; i < musicLength; i++) {
                    var thirdImage = musicFind[i]["im:image"][2].label;
                    var h3Title = $("<h3>", {
                        text: musicFind[i]["im:name"].label,
                    });
                    var pArtist = $("<p>", {
                        class: "artistName",
                        text: musicFind[i]["im:artist"].label,
                    });
                    var img = $("<img>", {
                        src: thirdImage,
                    });
                    var musicContainer = $("<div>", {
                        class: "col-xs-4 artist",
                    });
                    musicContainer.append(h3Title, pArtist, img)
                    $body.append(musicContainer);

                    (function () {
                        $(musicContainer).click(function () {       //UNIVERSAL CLICK HANDLER TO PASS NAME
                            var artist = $(this).find(".artistName").text();  //NAME TO BE USED TO LOAD INTO ALL FUNCTIONS
                            console.log("Artist:", artist);
                            wikiApiLoad(artist);                    //WIKIPEDIA API LOAD AND DUMP
                        });
                    })();
                }
            }
        });
    });
});