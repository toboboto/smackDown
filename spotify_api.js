/**
 * Created by JEkstroms on 8/5/15.
 */
var artistSpotifyID;
var artistSpotifyObj;
var artistSpotifyImgURL;
var artistSpotifyURI;
var albumSpotifyID;
var albumSpotifyObj;
var albumSpotifyImgURL;
var spotifyAlbum;
var spotifyTrackURI;
var search_value = "";
var audio;

var searchArtists = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },

        success: function (response) {
            //  resultsPlaceholder.innerHTML = template(response);
            artistSpotifyObj = response;
            console.log("artist object",artistSpotifyObj);
            artistSpotifyID = artistSpotifyObj.artists.items[0].id;
            console.log(artistSpotifyID);
            artistSpotifyImgURL = artistSpotifyObj.artists.items[0].images[0].url;
            console.log(artistSpotifyImgURL);
            artistSpotifyURI = artistSpotifyObj.artists.items[0].uri;
            $(".spotify_follow").attr("src","https://embed.spotify.com/follow/1/?uri="+ artistSpotifyURI);
            $(".firstLeftBar").append("<img src='"+artistSpotifyImgURL+"'>");
            console.log(search_value);


        }
    });
};
var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album'
        },

        success: function (response) {
            //  resultsPlaceholder.innerHTML = template(response);
            albumSpotifyObj = response;
            albumId = albumSpotifyObj.albums.items[0].id;
            console.log(albumId);
            getTrackURI(albumId);
            //$(".spotify_player").attr("src","https://embed.spotify.com/?uri=spotify:album:"+ albumId);
        }
    });
};

var getTrackURI = function (albumId) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            spotifyAlbum = response;
            console.log("album",spotifyAlbum);
            spotifyTrackURI = spotifyAlbum.tracks.items[0].uri;
            console.log(spotifyTrackURI);
            $(".spotify_player").attr("src","https://embed.spotify.com/?uri="+ spotifyTrackURI);
            var preview_link = spotifyAlbum.tracks.items[0].preview_url;
            audio = new Audio(preview_link);
            audio.play();
            console.log("audio",audio);
            $(".firstRightBar").append("<script type='text/javascript' src='http://www.bandsintown.com/javascripts/bit_widget.js'></script>").append("<a href='http://www.bandsintown.com' class='bit-widget-initializer' data-artist='"+artist+"'>Bandsintown</a>");

        }
    });
};

function play(){
    console.log("play");
}


function modalClose(){
    audio.pause();
    $(".firstLeftBar").empty();
    $(".firstRightBar").empty();

}

$(document).ready(function() {
    $("#show-widget").click(function() {
        new BIT.Widget({
            "artist":artist,
            "div_id":"tour-dates",
            "bg_color": "#FFFFFF"
        }).insert_events();
    });
});