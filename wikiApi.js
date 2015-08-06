/****************************************************************************
 * FUNCTION NAME: wikiApiLoad
 * PURPOSE: Called when artist image is pressed, compiles infobox data into arrays to append to page
 * PARAMETERS: artistName (The name passed into wikipedia to extrapolate data)
 */
var test;

function wikiApiLoad(artistName) {
    var request = artistName.replace(/ /g, "_");
    $.ajax({
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + request + "&callback=?",
        dataType: "jsonp",
        success: function (data) {
            $(".dummyLayout").html(data.parse.text["*"]);
            var infobox = $(".infobox tbody").find("tr");              //THIS ARRAY HOLDS ALL THE INFO WE NEED FROM WIKIPEDIA!!!
            var header = $("<h2>",{
                text: artistName,
            });
            $(".artistModal").append(header);
            for(var i = 0; i <= infobox.length; i++){
                if($(infobox[i]).find("th").text() == "Years active"){
                    var header = $("<h3>",{
                        class: "yrsActiveHeader",
                        text: "Years Active"
                    });
                    var divyears = $("<div>",{
                        class: "yrsActive",
                        html: $(infobox[i]).find("td"),
                    });
                    $(".artistModal").append(header, divyears);
                }
                if($(infobox[i]).find("th").text() == "Members"){
                    var header = $("<h3>",{
                        class: "membersHeader",
                        text: "Members",
                    });
                    var divmembers = $("<div>",{
                        class: "members",
                        html: $(infobox[i]).find("td"),
                    });
                    $(".artistModal").append(header, divmembers);
                    console.log(divmembers);
                }
            }
            (function(){
                $('.members').click(function () {
                    console.log("This works", this);
                });
            });
            console.log("This is infobox", infobox);      //Test console logging the zero index of this array
        },
        error: function (errorMessage) {
        }
    });
}

