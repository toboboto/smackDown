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
var spotifyArtistName;

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
            //console.log("artist object",artistSpotifyObj);
            artistSpotifyID = artistSpotifyObj.artists.items[0].id;
            //console.log(artistSpotifyID);
            artistSpotifyImgURL = artistSpotifyObj.artists.items[0].images[0].url;
            //console.log(artistSpotifyImgURL);
            artistSpotifyURI = artistSpotifyObj.artists.items[0].uri;
            $(".spotify_follow").attr("src","https://embed.spotify.com/follow/1/?uri="+ artistSpotifyURI);
            $(".artistBg").css({
                "background-image": "url(" +artistSpotifyImgURL + ")",
                "background-repeat": "no-repeat",
                "background-color": "#4a4a4a",
                "background-size": "cover"
            });
            //console.log(search_value);
            spotifyArtistName = artistSpotifyObj.artists.items[0].name;
            wikiApiLoad(spotifyArtistName);
            $(".artistHeader").html("<h2>"+spotifyArtistName+"</h2>");
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
            //console.log(albumId);
            getTrackURI(albumId);
            //$(".spotify_player").attr("src","https://embed.spotify.com/?uri=spotify:album:"+ albumId);
        }
    });
};

var getTrackURI = function (albumId) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            if(audio){
                audio.pause();
            }
            spotifyAlbum = response;
            //console.log("album",spotifyAlbum);
            spotifyTrackURI = spotifyAlbum.tracks.items[0].uri;
            //console.log(spotifyTrackURI);
            $(".spotify_player").attr("src", "https://embed.spotify.com/?uri=" + spotifyTrackURI);
            var preview_link = spotifyAlbum.tracks.items[0].preview_url;
            audio = new Audio(preview_link);
            audio.play();
            //console.log("audio",audio);
            $(".shows").html("<script type='text/javascript' src='http://www.bandsintown.com/javascripts/bit_widget.js'></script>");
            $(".shows").html("<a href='http://www.bandsintown.com' class='bit-widget-initializer' data-artist='"+artist+"'>Bandsintown</a>");
            setTimeout(function(){
                $(".album-art-container .clickable").css({
                    'margin-top': '20px'
                });
            }, 9000);
        }
    });
};

function play(){
    console.log("play");
}


function modalClose(){
    audio.pause();
    $(".imageContainer").empty();
    $(".shows").empty();
    $(".artistHeader, .artistSub, .spotify_follow, .spotify_player").empty();

}

function search() {
    artist = $(".search_field").val();  //NAME TO BE USED TO LOAD INTO ALL FUNCTIONS
    if(!artist){
        $(".errorContainer").stop().fadeIn().delay(3000).fadeOut();
        return;
    }
    console.log("Artist:", artist);
    $('.modal').modal();
    $('#modal').modal('toggle');
    searchArtists(artist);
    searchAlbums(artist);
};
