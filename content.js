// initialize global variables
var name = null;
var set = null;

$(document).ready(function() {

  // get card name from page text
  var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value")
  name = $.trim(name.text());
  // get card set from page text
  var set  = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value")
  set = $.trim(set.text());

  // set null variables
  var hiprice = null;
  var lowprice = null;
  var avgprice = null;
  var foilavgprice = null;
  var storelink = null;

  // Transform bad set names into applicable set names
  var set_map = {};
  set_map['Limited Edition Alpha'] = 'Alpha Edition';
  set_map['Limited Edition Beta'] = 'Beta Edition';
  set_map['Seventh Edition'] = '7th Edition';
  set_map['Eigth Edition'] = '8th Edition';
  set_map['Ninth Edition'] = '9th Edition';
  set_map['Tenth Edition'] = '10th Edition';
  set_map['Planechase 2012 Edition'] = 'Planechase 2012';
  set_map['Magic: The Gathering-Commander'] = 'Commander';
  set_map['Magic: The Gathering-Commander 2013'] = 'Commander 2013';
  set_map['Ravnica: City of Guilds'] = 'Ravnica';

  if (set_map[set] != undefined) { set = set_map[set] };

  m = set.match(/Magic 20(\d\d)/);
  if (m != null) {
    year = m[1];
    if (typeof(year) == "string") { set = "Magic 20" + year + " (M" + year + ")";};
  };

  // Append the price div to the left column
  var price_div = $('<div class=price></div>')
  $(".leftCol").append(price_div);

  // Prepare variables needed for API query
  var pk = "GATHERPRICES";
  var all_sets = false;
  var url = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=" + pk + "&s=" + set + "&p=" + name;

  // Query TCGplayer's Hi-Mid-Low API
  $.get( url, handleAPIResult ).fail( function() {
    // If failed, try again, but without Set name (gives average for all sets)
    url = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=" + pk + "&s=&p=" + name;
    $.get( url, reportAllSets ).fail( function() {
      $(".leftCol").append('<div id="error">Sorry, an error occured fetching price data</div>');
    });
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

function handleAPIResult( xml ) {
  hiprice = "$" + $(xml).find("hiprice").text();
  lowprice = "$" + $(xml).find("lowprice").text();
  avgprice = "$" + $(xml).find("avgprice").text();
  foilavgprice = "$" + $(xml).find("foilavgprice").text();
  storelink = $(xml).find("link").text();

  if (hiprice == "$0") { hiprice = "Unavailable" };
  if (lowprice == "$0") { lowprice = "Unavailable" };
  if (avgprice == "$0") { avgprice = "Unavailable" };
  if (foilavgprice == "$0") { foilavgprice = "N/A" };

  // Add the price data to the price div on the page
  $('.price').append(
    '<div id="himidlow">' +
      '<div id="hiprice"><a href="' + storelink + '">H: ' + hiprice + '</a></div>' +
      '<div id="avgprice"><a href="' + storelink + '">M: ' + avgprice + '</a></div>' +
      '<div id="lowprice"><a href="' + storelink + '">L: ' + lowprice + '</a></div>' +
    '</div>' +
    '<div id="foilavgprice"><a href="' + storelink + '">Foil M: ' + foilavgprice + '</a></div>'
  );
  // Add store link
  // $('.leftCol').append(
  //   '<div id="storelink"><a href="' + storelink +'">Buy ' + name + '</div></a>'
  // );
}

function reportAllSets( xml ) {
  handleAPIResult(xml);
  $('.price').css('font-style', 'italic')
  var footnote_msg = 'These prices are aggregated over all available printings of this card, because the printing you selected does not have any available pricing data. Perhaps you selected a Masters Edition, Promo, or other unusual printing.';
  var footnote = $('<div id="footnote" title="' + footnote_msg + '">Why are the prices in italics?</div>');
  $('.leftCol').append(footnote);
  $(footnote).click( function() { alert(footnote_msg) } );
};
