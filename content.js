$(document).ready(function() {

  // get card name from page text
  var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value").text();
  // get card set from page text
  var set  = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value").text();
  
  // get multiverse ID from HTTP params
  // var id = getURLParameter("multiverseid");

  // get card name from HTTP params
  // var name = getURLParameter("name");

  // Query TCGplayer's API
  var pk = "GATHERERPRICES"
  var url = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=" + pk + "&s=" + set + "&p=" + name
  $.get( url, function( xml ) {
    alert(xml)
    $(".leftCol").append("<div>" + xml + "</div>");   
  });

  $(".leftCol").append("<div>" + name + "</div>");
  $(".leftCol").append("<div>" + set + "</div>");

  // send message to the extension containing the card ID and Name
  chrome.runtime.sendMessage(
  {
    cardinfo: 
    {
      cardname: name, 
      cardset:  set
    }
  }, function(response) {
    // do stuff?
  });

})

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}
