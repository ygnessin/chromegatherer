$(document).ready(function() {

  // get card name from page text
  var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value").text();
  name = $.trim(name)
  // get card set from page text
  var set  = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value").text();
  set = $.trim(set)

  // set null variables
  var hiprice = null
  var lowprice = null
  var avgprice = null
  var foilavgprice = null
  var storelink = null

  // Transform bad set names into applicable set names
  var set_map = {}
  set_map['Limited Edition Alpha'] = 'Alpha Edition'
  set_map['Limited Edition Beta'] = 'Beta Edition'
  set_map['Seventh Edition'] = '7th Edition'
  set_map['Eigth Edition'] = '8th Edition'
  set_map['Ninth Edition'] = '9th Edition'
  set_map['Tenth Edition'] = '10th Edition'
  set_map['Planechase 2012 Edition'] = 'Planechase 2012'
  set_map['Magic: The Gathering-Commander'] = 'Commander'
  set_map['Magic: The Gathering-Commander 2013'] = 'Commander 2013'
  set_map['Ravnica: City of Guilds'] = 'Ravnica'

  if (set_map[set] != undefined) { set = set_map[set] };

  m = set.match(/Magic 20(\d\d)/);
  if (m != null) {
    year = m[1]
    if (typeof(year) == "string") { set = "Magic 20" + year + " (M" + year + ")";};
  };

  // Query TCGplayer's API
  var pk = "GATHERPRICES"
  var url = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=" + pk + "&s=" + set + "&p=" + name
  $.get( url, function( xml ) {
    // TODO: handle bad GET requests (request without set, print with italics)
    hiprice = "$" + $(xml).find("hiprice").text();
    lowprice = "$" + $(xml).find("lowprice").text();
    avgprice = "$" + $(xml).find("avgprice").text();
    foilavgprice = "$" + $(xml).find("foilavgprice").text();
    storelink = "$" + $(xml).find("link").text();

    if (hiprice == "$0") { hiprice = "Unavailable" };
    if (lowprice == "$0") { lowprice = "Unavailable" };
    if (avgprice == "$0") { avgprice = "Unavailable" };
    if (foilavgprice == "$0") { foilavgprice = "N/A" };

    // Add the prices to the page
    $(".leftCol").append('<div class="space"</div>'); //so I don't interfere with variations div
    $(".leftCol").append(
      '<div class="price">' +
        '<div id="himidlow">' +
          '<div id="hiprice">H: ' + hiprice + '</div>' +
          '<div id="avgprice">M: ' + avgprice + '</div>' +
          '<div id="lowprice">L: ' + lowprice + '</div>' +
        '</div>' +
        '<div id="foilavgprice">Foil M: ' + foilavgprice + '</div>' +
      '</div>'
    );
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
