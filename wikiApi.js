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
            $(".dummyLayout").html("");
            $(".dummyLayout").html(data.parse.text["*"]);

            //REDIRECT FIX
            var redirectStore = $(".redirectText");
            if(redirectStore[0] != undefined){
                //If the search is a redirect, take the redirect title and plug it back into this function to search again
                wikiApiLoad($(".redirectText").find("a").text());
            }

            //MULTIPLE SEARCH FIX
            var multiStore = $(".dummyLayout p:first-child").text();
            var multiCheck = multiStore.substr(multiStore.length-9);
            if (multiCheck == "refer to:"){
                wikiApiLoad(request + "_(musician)");
            }

            //If we ran this function through the multiple search fix, we have to cut off "_(musician)"
            if (artistName.substr(artistName.length-11)=="_(musician)"){
                artistName = artistName.substr(0, artistName.length-11);
            }

            var infobox = $(".infobox tbody").find("tr");              //THIS ARRAY HOLDS ALL THE INFO WE NEED FROM WIKIPEDIA!!!
            $(".artistInfo").html("");                                 //RESET

            var header = $("<h2>",{
                text: artistName,
            });
            $(".artistInfo").append(header);
            //We will comb through the infobox array for years active and members data
            for(var i = 0; i <= infobox.length; i++) {
                //Check for a years active header (th), then go into that header and extract
                if ($(infobox[i]).find("th").text() == "Years active") {
                    var header = $("<h3>", {
                        class: "yrsActiveHeader",
                        text: "Years Active"
                    });
                    $(".artistInfo").append(header);
                    var divyears = $("<div>", {
                        class: "yrsActive",
                        html: $(infobox[i]).find("td"),
                    });
                    $(".artistInfo").append(divyears);
                }
                //Check for a members header (th), then go into that header and check
                if($(infobox[i]).find("th").text() == "Members") {
                    //Check if the members list are in the form of <a> tags
                    if ($(infobox[i]).find("td").has("a")[0] != undefined) {
                        var header = $("<h3>", {
                            class: "membersHeader",
                            text: "Members",
                        });
                        var divmembers = $("<div>", {
                            class: "member",
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
                    $(".associatedContainer").remove();
                    var divContainer = $("<div>",{
                        class: "associatedContainer",
                    })
                    var header = $("<h3>", {
                        class: "associatedHeader",
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
                wikiApiLoad(affiliatedName);
            });
        },
        error: function (errorMessage) {
            console.log("NO WORK");
        }
    });
}

