/**
 * Created by JEkstroms on 8/5/15.
 */
var artistSpotifyID;
var artistSpotifyObj;
var artistSpotifyImgURL;
var albumSpotifyID;
var albumSpotifyObj;
var albumSpotifyImgURL;
var spotifyAlbum;
var spotifyTrackURI;
var search_value = "";

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
            console.log(artistSpotifyObj);
            artistSpotifyID = artistSpotifyObj.artists.items[0].id;
            console.log(artistSpotifyID);
            artistSpotifyImgURL = artistSpotifyObj.artists.items[0].images[0].url;
            console.log(artistSpotifyImgURL);
            $(".dummyLayout").append("<img src='"+artistSpotifyImgURL+"'>").show();
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
            var test = new Audio(preview_link);
            test.play();

            (function() {
                $(".clickable").trigger('click');
            })();
        }
    });
};

function play(){

    console.log("play");
}


$(document).ready(function(){

    $("#spotify_submit").click(function(){
        console.log(search_value);
        searchArtists($(".spotify_search").val());
        searchAlbums($(".spotify_search").val());
    })
})