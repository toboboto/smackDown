var test;
var global_result = null;
var artist;

//Array to store genres and their apple rss id's with a select box
var searchGenre =[
    {genre: "All", id: ""},
    {genre: "Alternative", id:20},
    {genre: "Blues", id:2},
    {genre: "Brazilian", id:1122},
    {genre: "Children's Music", id:4},
    {genre: "Chinese", id:1232},
    {genre: "Christian/Gospel", id:22},
    {genre: "Classical", id:5},
    {genre: "Country", id:6},
    {genre: "Dance", id:17},
    {genre: "Easy Listening", id:25},
    {genre: "Electronic", id:7},
    {genre: "Enka", id:28},
    {genre: "Fitness/Workout", id:50},
    {genre: "Hiphop/Rap", id:18},
    {genre: "Holiday", id:8},
    {genre: "Indian", id:1262},
    {genre: "Instrumental", id:53},
    {genre: "Jpop", id:27},
    {genre: "Jazz", id:11},
    {genre: "Kpop", id:51},
    {genre: "Karaoke", id:52},
    {genre: "Kayokyoku", id:30},
    {genre: "Korean", id:1243},
    {genre: "Latino", id:12},
    {genre: "New Age", id:13},
    {genre: "Opera", id:9},
    {genre: "Pop", id:14},
    {genre: "R&B/Soul", id:15},
    {genre: "Reggae", id:24},
    {genre: "Rock", id:21},
    {genre: "Singer/Songwriter", id:10},
    {genre: "Soundtrack", id:16},
    {genre: "Vocal", id:23},
    {genre: "World", id:19}
];

//Array to search based on top songs or top albums with a select box
var searchType=[
    {typeText: "Top Songs", type:"topsongs"},
    {typeText: "Top Albums", type:"topalbums"}
];

//Array to set the limit of returns with a select box
var limitsSet = [10, 25, 50, 100, 200];

/****************************************************************************
 * FUNCTION NAME: appleApiRetrieve()
 * PURPOSE: Displays songs/albums based on parameters by appending them as html elements
 * PARAMETERS: None
 */
function appleApiRetrieve(){
    $(".musicGrid").empty();      //Remove for refresh purposes
    var searchNumber = $(".limit").val();   //Stores the amount of searches desired
    var searchIndex = $(".genreDropDown").find(":selected").attr("data-index"); //Stores the genre index
    var searchTypeIndex = $(".searchTypeDropDown").find(":selected").attr("data-index");    //
    $.ajax({
        dataType: 'json',
        url: 'https://itunes.apple.com/us/rss/'+searchType[searchTypeIndex].type+'/limit='+searchNumber+'/genre='+searchGenre[searchIndex].id+'/json',
        success: function (result) {
            console.log('loaded', result);
            global_result = result;
            var musicFind = global_result.feed.entry;
            var musicLength = musicFind.length;
            var $grid = $(".musicGrid");

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
                    class: "col-xs-12 col-sm-4 artist",
                });
                var headerContainer = $("<div>", {
                    class: "col-xs-12 album-header",
                    style: "overflow-y: hidden"
                });
                headerContainer.append(h3Title, pArtist)
                musicContainer.append(headerContainer, img)

                $grid.append(musicContainer);

                //GIVES EACH ALBUM A CLICK HANDLER WHICH CALLS WIKIAPILOAD
                (function () {
                    $(musicContainer).click(function () {       //UNIVERSAL CLICK HANDLER TO PASS NAME
                        artist = $(this).find(".artistName").text();  //NAME TO BE USED TO LOAD INTO ALL FUNCTIONS
                        console.log("Artist:", artist);
                        $('.modal').modal();
                        $('#modal').modal('toggle');
                        //$(".artistModal").fadeIn();  // test remove to equip bootstrap modal
                        wikiApiLoad(artist);

                        searchArtists(artist);
                        searchAlbums(artist);//WIKIPEDIA API LOAD AND DUMP
                    });
                })();
            }
        }
    });
}
//__________________END appleApiRetrieve()_________/



//ON DOCUMENT LOAD
$(document).ready(function() {

    //Hide the modal
    setTimeout(function(){
        $(".getHitsLanding").fadeOut(1000);
    }, 1500);

    //Load top hits on page load
    setTimeout(function(){
        appleApiRetrieve();
    }, 2000);

    //$("#getHits").trigger("click");

    //Hidden div to store potential data
    $(".dummyLayout").hide();

    //Creates the genre dropdown options and gives the dropdown items for genre indices which sync up to this array
    for(var i = 0; i < searchGenre.length; i++){
        var option = $("<option>",{
            text: searchGenre[i].genre,
            "data-index": i,
        });
        $(".genreDropDown").append(option);
    }

    //Creates the search type dropdown options and gives the dropdown items for the search type indices which sync up to this array
    for(var i = 0; i < searchType.length; i++){
        var option = $("<option>",{
            text: searchType[i].typeText,
            "data-index": i,
        });
        $(".searchTypeDropDown").append(option);
    }

    //Creates the genre dropdown options and gives the dropdown items for the limits indices which sync up to this array
    for(var i = 0; i < limitsSet.length; i++){
        var option = $("<option>",{
            text: limitsSet[i]
        });
        $(".limit").append(option);
    }

    //Onclick of get hits, the list populates based on selected parameters
    $("#getHits").click(function () {
        appleApiRetrieve();
    });
});