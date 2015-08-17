//data.parse.title to search for "(disambiguation)" (substr(length-16))
/*
Disambiguation Procedure:
Instead of looking for keyword "disambiguation" and re-running the search
with it, look for "years active" as a trigger. Some bands may still have
"disambiguation" under it. If this is the case, it will infinite loop.

Redirect Procedure:
Already completed below

Multiple Search Procedure:
Run through "band", then "musician", then "singer".
 */

//var searchIssue = {
//"disambiguation":{
//
//
//},
//}
//

var flags = {
    'musician': false,
    'singer': false,
    'band': false
};
var testArray = [];
/****************************************************************************
 * FUNCTION NAME: wikiApiLoad
 * PURPOSE: Called when artist image is pressed, compiles infobox data into arrays to append to page
 * PARAMETERS: artistName (The name passed into wikipedia to extrapolate data)
 */
function wikiApiLoad(artistName) {
    var request = artistName.replace(/ /g, "_");
    console.log("result:", request);
    $.ajax({
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + request + "&callback=?",
        dataType: "jsonp",
        success: function (data) {
            console.log(data);
            $(".dummyLayout").html("");                                 //CLEAR HTML
            if (data.hasOwnProperty('parse')){                          //ADD NEW DATA IF PARSE PROPERTY EXISTS(it won't if search returns bad results)
                $(".dummyLayout").html(data.parse.text["*"]);
            }
            var infobox = $(".infobox tbody").find("tr");               //THIS ARRAY HOLDS ALL THE INFO WE NEED FROM WIKIPEDIA!!!(undefined if we had a bad search)
            var headerArray = [];
            var textArray = [];
            $(infobox).find("th").each(function(){
                headerArray[headerArray.length] = $(this).text();
                testArray[testArray.length] = $(this).text();
            });
            $(infobox).find("td").each(function(){
                textArray[textArray.length] = $(this).text();
            });
            console.log(headerArray);
            console.log(textArray);

            var findYrsActive = false;
            for (var i = 0; i < headerArray.length; i++){
                console.log("RUNNING LOOP", headerArray[i]);
                if (headerArray[i].indexOf("Years") != -1) {
                    findYrsActive = true;                               //Set flag if we found a "Years active" header (indicative of a musical artist's wiki page)
                    console.log("FOUND YEARS ACTIVE");
                }
            }

            //REDIRECT FIX
            var redirectStore = $(".redirectText");
            if(redirectStore[0] != undefined){
                //If the search is a redirect, take the redirect title and plug it back into this function to search again
                console.log($(".redirectText").find("a").text());
                wikiApiLoad($(".redirectText").find("a").text());
                return;
            }

            console.log(artistName);
            console.log("Musician flag set to:", flags['musician']);
            if(!findYrsActive && !flags['musician']){                   //If we couldn't find "Years active", our search wasn't specific enough
                flags['musician'] = true;                               //Set to true so when we run this function recursively, we'll move to "singer"
                console.log("I ran");
                wikiApiLoad(artistName + "_(musician)");                //Run the search again with "_(musician)" suffix tacked on
                return;                                                 //Break so that once it is completed, the recursive function stops
                console.log("Am I running");
            } else if (!findYrsActive && !flags['singer']){             //Search with "_(singer)" if musician returned bad search
                flags['singer'] = true;
                artistName = artistName.substr(0, artistName.length-11);//If we skip this, we're effectively searching with "artist_(musician)_(singer)"
                wikiApiLoad(artistName + "_(singer)");
                return;
            } else if (!findYrsActive && !flags['band']){               //Search with "_(band)" if singer returned bad search
                flags['band'] = true;
                artistName = artistName.substr(0, artistName.length-9);
                wikiApiLoad(artistName + "_(band)");
                return;
            }

            flags = {                                                   //Set all flags to true again for next artist search
                'musician': false,
                'singer': false,
                'band': false
            };



            //If we ran this function with suffixes added we have to cut off these suffixes for it to display nicely
            if (artistName.substr(artistName.length-11)=="_(musician)"){
                artistName = artistName.substr(0, artistName.length-11);
            } else if (artistName.substr(artistName.length-9)=="_(singer)"){
                artistName = artistName.substr(0, artistName.length-9);
            } else if (artistName.substr(artistName.length-7)=="_(band)"){
                artistName = artistName.substr(0, artistName.length-7);
            }

            $(".artistInfo").empty();                                 //RESET

            var header = $("<h2>",{
                text: artistName,
            });
            $(".artistInfo").append(header);
            //We will comb through the infobox array for years active and members data
            for(var i = 0; i <= infobox.length; i++) {
                //Check for a years active header (th), then go into that header and extract
                if ($(infobox[i]).find("th").text().indexOf("Years") != -1){
                    var header = $("<h3>", {
                        class: "yrsActiveHeader text-center",
                        text: "Years Active"
                    });
                    $(".artistInfo").append(header);
                    var divyears = $("<div>", {
                        class: "yrsActive text-center",
                        text: $(infobox[i]).find("td").text(),
                    });

                    //
                    console.log($(header).text());
                    $(".artistInfo").append(header, divyears);
                }
                if($(infobox[i]).find("th").text().indexOf("Associated") != -1) {
                    $(".associatedContainer").empty();
                    var divContainer = $("<div>",{
                        class: "associatedContainer text-center",
                    })
                    var header = $("<h3>", {
                        class: "associatedHeader text-center",
                        text: artistName + "'s Associated Acts",
                    });
                    var divassociated = $("<div>", {
                        class: "associated",
                        html: $(infobox[i]).find("td"),
                    });
                    $(divContainer).append(header, divassociated);
                    $(".artistInfo").append(divContainer);
                    $('.associated a').removeAttr('href');
                }
                //Check for a members header (th), then go into that header and check
                if($(infobox[i]).find("th").text() == "Members" || $(infobox[i]).find("th").text() == "Past members") {
                    //Check if the members list are in the form of <a> tags
                    if ($(infobox[i]).find("td").has("a")[0] != undefined) {
                        var header = $("<h3>", {
                            class: "membersHeader",
                            text: "Members",
                        });
                        var divmembers = $("<div>", {
                            class: "member text-center",
                            html: $(infobox[i]).find("td"),
                        });
                        $(".artistInfo").append(header, divmembers);
                        console.log(divmembers);
                        $('.member a').removeAttr('href');
                    }
                    //Check if the members list are not in the form of <a> tags
                    else if ($(infobox[i]).find("td").has("a")[0] == undefined){
                        var header = $("<h3>", {
                            class: "membersHeader",
                            text: "Members",
                        });
                        var membersText = $(infobox[i]).find("td").text();
                        var membersArray = membersText.split('\n');
                        console.log(membersArray);
                        var divmembers = $("<div>", {
                            class: "members",
                        });
                        for(var j = 0; j < membersArray.length; j++){
                            var pMembers = $("<p>",{
                                class: "member",
                                text: membersArray[j],
                            });
                            $(divmembers).append(pMembers);
                        }
                        $(".artistInfo").append(header, divmembers);
                    }
                }
            }
            //On click of the member element, pull a list of affiliated acts
            $(".member").on("click", "a, p", function(){
                var memberName = $(this).text();
                affiliatedArtist(memberName);
            });
            $(".associated").on("click", "a", function(){
                var affiliatedName = $(this).text();
                searchArtists(affiliatedName);
                searchAlbums(affiliatedName);
            });
        },
        error: function (errorMessage) {
        }
    });
}

/****************************************************************************
 * FUNCTION NAME: wikiApiLoad
 * PURPOSE: Called when artist image is pressed, compiles infobox data into arrays to append to page
 * PARAMETERS: artistName (The name passed into wikipedia to extrapolate data)
 */


function affiliatedArtist(memberName){
    var request = memberName.replace(/ /g, "_");
    $.ajax({
        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + request + "&callback=?",
        dataType: "jsonp",
        success: function (data) {
            $(".dummyLayout").html("");
            $(".dummyLayout").html(data.parse.text["*"]);


            //REDIRECT FIX
            var redirectStore = $(".redirectText");
            if(redirectStore[0] != undefined){
                //If the search is a redirect, take the redirect title and plug it back into this function to search again
                affiliatedArtist($(".redirectText").find("a").text());
            }

            //MULTIPLE SEARCH FIX
            var multiStore = $(".dummyLayout p:first-child").text();
            var multiCheck = multiStore.substr(multiStore.length-9);
            if (multiCheck == "refer to:"){
                console.log("I ran");
                affiliatedArtist(request + "_(musician)");
            }

            //If we ran this function through the multiple search fix, we have to cut off "_(musician)"
            if (memberName.substr(memberName.length-11)=="_(musician)"){
                memberName = memberName.substr(0, memberName.length-11);
            }


            var infobox = $(".infobox tbody").find("tr");              //THIS ARRAY HOLDS ALL THE INFO WE NEED FROM WIKIPEDIA!!!
            for(var i = 0; i <= infobox.length; i++){
                if($(infobox[i]).find("th").text() == "Associated acts") {
                    $(".associatedContainer").empty();
                    var divContainer = $("<div>",{
                        class: "associatedContainer text-center",
                    })
                    var header = $("<h3>", {
                        class: "associatedHeader text-center",
                        text: memberName + "'s Associated Acts",
                    });
                    var divassociated = $("<div>", {
                        class: "associated",
                        html: $(infobox[i]).find("td"),
                    });
                    $(divContainer).append(header, divassociated);
                    $(".artistInfo").append(divContainer);
                    $('.associated a').removeAttr('href');
                }
            }
            $(".associated").on("click", "a", function(){
                var affiliatedName = $(this).text();
                searchArtists(affiliatedName);
                searchAlbums(affiliatedName);
            });
        },
        error: function (errorMessage) {
            console.log("NO WORK");
        }
    });
}

