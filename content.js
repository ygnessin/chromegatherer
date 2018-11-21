$(document).ready(function() {
  // get card name from page text
  var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value");

  // get card set from page text
  var set = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value");

  // Handle double-sided cards and split cards
  var second_name;
  if (name.text().length == 0) {
    name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl07_nameRow > .value");
    set = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl07_setRow > .value");

    // Set up Split card names in case this is a Split card
    second_name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl08_nameRow > .value");

    // Sometimes split cards use ctl09 and ctl10
    if (name.text().length == 0) {
      name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl09_nameRow > .value");
      set = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl09_setRow > .value");
      second_name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl10_nameRow > .value");
    }

    // Sometimes split cards use ctl02 and ctl03
    if (name.text().length == 0) {
      name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl02_nameRow > .value");
      set = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl02_setRow > .value");
      second_name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl03_nameRow > .value");
    }

    // Sometimes split cards use ctl03 and ctl04
    if (name.text().length == 0) {
      name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl03_nameRow > .value");
      set = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl03_setRow > .value");
      second_name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_ctl04_nameRow > .value");
    }
  }

  // trim spaces and handle AE characters
  set = $.trim(set.text());
  name = escape($.trim(name.text())).replace('%C6', 'AE');
  if (second_name) {
    second_name = escape($.trim(second_name.text())).replace('%C6', 'AE');
  }

  var split_name_1 = name + '+%2f%2f+' + second_name
  var split_name_2 = second_name + '+%2f%2f+' + name

  // set null variables
  var hiprice = null;
  var lowprice = null;
  var avgprice = null;
  var foilavgprice = null;
  var storelink = null;

  if (SET_MAP[set] != undefined) { set = SET_MAP[set] };

  set = set.replace(/Magic: The Gathering\b\S\b/, '');

  m = set.match(/Magic 20(\d\d)/);
  if (m != null) {
    year = m[1];
    if (typeof(year) == "string") { set = "Magic 20" + year + " (M" + year + ")";};
  };

  if (set.includes('Duel Decks Anthology')) {
    set = 'Duel Decks: Anthology';
  }

  // Append the price div to the left column
  var price_div = $('<div class=price></div>')
  $(".leftCol").append(price_div);

  // Prepare variables needed for API query
  var url = apiUrl(set, name);

  // Query TCGplayer's Hi-Mid-Low API
  $.get(url).done(function(xml) {
    handleApiResponse(xml, displayPrices, function() {
      // If failed, try again, but without Set name (gives average for all sets)
      url = apiUrl("", name);
      $.get(url).done(function(xml) {
        handleApiResponse(xml, displayAvgPricesForAllSets, function() {
          // If failed, maybe it's a Split card
          url = apiUrl(set, split_name_1);
          $.get(url).done(function(xml) {
            handleApiResponse(xml, displayPrices, function() {
              // If failed, maybe the split card names are backwards
              url = apiUrl(set, split_name_2);
              $.get(url).done(function(xml) {
                handleApiResponse(xml, displayPrices, function() {
                  // If still failed, give up and print an error
                  $(".leftCol").append('<div id="error">Sorry, an error occured fetching price data</div>');
                });
              });
            });
          });
        });
      });
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

function apiUrl(set, cardName) {
  return "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=GATHPRICE&s=" + set + "&p=" + cardName;
}

function handleApiResponse(xml, successFn, failFn) {
  if ($(xml).find("error").text() == "") {
    successFn(xml);
  } else {
    failFn();
  }
}

function displayPrices(xml) {
  hiprice = "$" + $(xml).find("hiprice").text();
  lowprice = "$" + $(xml).find("lowprice").text();
  avgprice = "$" + $(xml).find("avgprice").text();
  foilavgprice = "$" + $(xml).find("foilavgprice").text();
  storelink = $(xml).find("link").text();

  if (hiprice == "$0") { hiprice = "N/A" };
  if (lowprice == "$0") { lowprice = "N/A" };
  if (avgprice == "$0") { avgprice = "N/A" };
  if (foilavgprice == "$0") { foilavgprice = "N/A" };

  // Add the price data to the price div on the page
  $('.price').append(
    '<div id="himidlow">' +
      '<div class="hiprice"><a href="' + storelink + '">H: ' + hiprice + '</a></div>' +
      '<div class="avgprice"><a href="' + storelink + '">M: ' + avgprice + '</a></div>' +
      '<div class="lowprice"><a href="' + storelink + '">L: ' + lowprice + '</a></div>' +
    '</div>' +
    '<div class="foilavgprice"><a href="' + storelink + '">Foil M: ' + foilavgprice + '</a></div>'
  );

  // Set the widths for the price elements based on the price div
  stylePrices();
}

function displayAvgPricesForAllSets(xml) {
  displayPrices(xml);
  $('.price').css('font-style', 'italic')
  var footnote_msg = 'These prices are aggregated over all available printings of this card, because the printing you selected does not have any available pricing data.';
  var footnote = $('<div id="footnote" title="' + footnote_msg + '">Why are the prices in italics?</div>');
  $('.leftCol').append(footnote);
  $(footnote).click( function() { alert(footnote_msg) } );
};

function splitCSS() {
  $('.hiprice').css('width', 107);
  $('.avgprice').css('width', 106);
  $('.lowprice').css('width', 107);
}

function stylePrices() {
  var width = $('.price').width() / 3
  var fl = Math.floor(width)
  var cl = Math.ceil(width)
  var rnd = Math.round(width)

  $('.hiprice').css('width', rnd);
  $('.lowprice').css('width', rnd);

  if (rnd == cl) { $('.avgprice').css('width', fl) };
  if (rnd == fl) { $('.avgprice').css('width', cl) };

  // The new Gatherer layout has weird font color handling, so we need to do this here
  $('.price a').css('color', 'black');
}
