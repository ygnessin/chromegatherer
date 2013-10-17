$(document).ready(function() {

  // get card name from page text
  var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value").text();
  name = $.trim(name)
  // get card set from page text
  var set  = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value").text();
  set = $.trim(set)

  var hiprice = null
  var lowprice = null
  var avgprice = null
  var foilavgprice = null
  var storelink = null

  $(".leftCol").append('<div class="price" id="hiprice">hiprice</div>');
  $(".leftCol").append('<div class="price" id="avgprice">avgprice</div>');
  $(".leftCol").append('<div class="price" id="lowprice">lowprice</div>');
  $(".leftCol").append('<div class="price" id="foilavgprice">foilavgprice</div>');

  // Query TCGplayer's API
  var pk = "GATHERPRICES"
  var url = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=" + pk + "&s=" + set + "&p=" + name
  $.get( url, function( xml ) {
    hiprice = $(xml).find("hiprice").text();
    lowprice = $(xml).find("lowprice").text();
    avgprice = $(xml).find("avgprice").text();
    foilavgprice = $(xml).find("foilavgprice").text();
    storelink = $(xml).find("link").text();

    $(".leftCol").append("<div>" + avgprice + "</div>");
  });

  // send message to the extension containing the card ID and Name
  chrome.runtime.sendMessage(
  {
    cardinfo:
    {
      cardname: name,
      cardset:  set,
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
