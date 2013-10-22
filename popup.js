$(document).ready(function(){

  // Enables clicking links in the popup
  $('a').click(function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });

  // Get the card's name and set from the background page
  var name = chrome.extension.getBackgroundPage().name;
  var set = chrome.extension.getBackgroundPage().set;

  // // Print the card's name and set in the popup
  // $("#cardname").append("Name: " + name)
  // $("#cardset").append("Set: " + set)

  // // Prepare variables needed for API query
  // var pk = "TCGTEST"; // var pk = "GATHERPRICES"; // revert this when TCGP fixes their bug
  // var all_sets = false;
  // var url = "http://partner.tcgplayer.com/x3/pv.asmx/p?v=8&pk=" + pk + "&s=" + set + "&p=" + name;

  // // Query TCGplayer's Store Prices API
  // $.get( url, handleAPIResult ).fail( function() {
  //   // If failed, try again, but without Set name (gives average for all sets)
  //   url = "http://partner.tcgplayer.com/x3/pv.asmx/p?v=8&pk=" + pk + "&s=&p=" + name;
  //   $.get( url, handleAPIResult ).fail( function() {
  //     $("body").append('<div id="error">Sorry, an error occured fetching price data</div>');
  //   });
  // });

});

//TODO: implement this. Could I maybe do it with an iframe?????
function handleAPIResult( xml ) {
  supplier = $(xml).find("supplier")
}
