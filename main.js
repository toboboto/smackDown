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
            url: 'https://itunes.apple.com/us/rss/topsongs/limit=20/genre=1007/json',
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
                    var pArtist = $("<p>",{
                        text: musicFind[i]["im:artist"].label,
                    });
                    var img = $("<img>", {
                        src: thirdImage,
                    });
                    var musicContainer = $("<div>",{
                        class: "col-xs-4 artist",
                    });
                    musicContainer.append(h3Title, pArtist, img)
                    $body.append(musicContainer);

                    (function(){
                        $(musicContainer).click(function(){
                            var artist = $(this).find("p").text();
                            var request = artist.replace(/ /g, "_");
                            $.ajax({
                                type: "GET",
                                url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+request+"&callback=?",
                                contentType: "application/json; charset=utf-8",
                                async: false,
                                dataType: "jsonp",
                                success: function (data, textStatus, jqXHR) {
                                    $(".dummyLayout").html(data.parse.text["*"]);
                                    var infobox = $(".infobox tbody");              //THIS ARRAY HOLDS ALL THE INFO WE NEED FROM WIKIPEDIA!!!
                                    console.log("This is infobox",infobox[0]);      //Test console logging the zero index of this array
                                },
                                error: function (errorMessage) {
                                }
                            });
                        });
                    })();
                }
            }
        });
    });


    $(".artist").click(function(){
        var artist = $(this).find("p").text;
        console.log("yay");
        var request = "Father_John_Misty";

    });
});