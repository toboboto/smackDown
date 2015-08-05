/**
 * Created by turnkey on 8/5/15.
 */
var test;
var global_result = null;


//https://itunes.apple.com/us/rss/topsongs/limit=10/genre=1007/json
//https://itunes.apple.com/us/rss/topalbums/limit=10/genre=1007/json


$(document).ready(function(){
    $(".dummyLayout").hide();

    $("#getHits").click(function(){
        $.ajax({
            dataType: 'json',
            url: 'https://itunes.apple.com/us/rss/topsongs/limit=10/genre=1007/json',
            success: function(result){
                console.log('loaded',result);
                global_result = result;
                var musicFind = global_result.feed.entry;
                var musicLength = musicFind.length;
                var $body = $("body");
                for(var i = 0; i<musicLength; i++){
                    var thirdImage = musicFind[i]["im:image"][2].label;
                    var h3Title = $("<h3>",{
                        text: musicFind[i]["im:name"].label,
                    });
                    var pDirector = $("<p>",{
                        text: musicFind[i]["im:artist"].label,
                    });
                    var img = $("<img>", {
                        src: thirdImage,
                    });
                    var musicContainer = $("<div>",{
                        class: "col-xs-4",
                    });
                    musicContainer.append(h3Title, pDirector, img)
                    $body.append(musicContainer);
                }
            }
        });
    });

    $("#go").click(function(){
        var request = "Black_Sabbath"
        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+request+"&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "jsonp",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                test = data;
                $(".dummyLayout").html(data.parse.text["*"]);
                var thing = $(".infobox tbody");
                console.log(thing);

            },
            error: function (errorMessage) {
            }

        });
    });
});