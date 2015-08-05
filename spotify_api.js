/**
 * Created by JEkstroms on 8/5/15.
 */
var artistSpotifyID;
var artistSpotifyObj;
var artistSpotifyImgURL;
var albumSpotifyID;
var albumSpotifyObj;
var albumSpotifyImgURL;
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
            artistSpotifyImgURL = artistSpotifyObj.artists.items[0].images[1].url;
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
            console.log(albumSpotifyObj);

        }
    });
};

var getTrackURI = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            callback(response);
        }
    });
};


$(document).ready(function(){

    $("#spotify_submit").click(function(){
        console.log(search_value);
        searchArtists($(".spotify_search").val());
        searchAlbums($(".spotify_search").val());
    })
})