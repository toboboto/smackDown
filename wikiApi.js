/****************************************************************************
 * FUNCTION NAME: wikiApiLoad
 * PURPOSE: Called when artist image is pressed, compiles infobox data into arrays to append to page
 * PARAMETERS: artistName (The name passed into wikipedia to extrapolate data)
 */

function wikiApiLoad(artistName) {
    var request = artistName.replace(/ /g, "_");
    $.ajax({
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + request + "&callback=?",
        dataType: "jsonp",
        success: function (data) {
            $(".dummyLayout").html(data.parse.text["*"]);
            var infobox = $(".infobox tbody").find("tr");              //THIS ARRAY HOLDS ALL THE INFO WE NEED FROM WIKIPEDIA!!!
            test = infobox;                                 //dummy test array
            for(var i = 0; i <= infobox.length; i++){
                if($(test[i]).find("th").text() == "Years active"){
                    console.log($(test[i]).text());
                }
                if($(test[i]).find("th").text() == "Members"){
                    console.log($(test[i]).text());
                }
            }
            console.log("This is infobox", infobox);      //Test console logging the zero index of this array
        },
        error: function (errorMessage) {
        }
    });
}