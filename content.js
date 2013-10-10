$(document).ready(function() {

  var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow > .value").text();
  var set  = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_setRow > .value").text();
  
  // get multiverse ID from HTTP params
  // var id = getURLParameter("multiverseid");

  // get card name from HTTP params
  // var name = getURLParameter("name");

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
