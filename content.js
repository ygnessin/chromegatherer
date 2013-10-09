$(document).ready(function() {

  // var name = $("#ctl00_ctl00_ctl00_MainContent_SubContent_SubContent_nameRow.value").toString();

  // get multiverse ID from HTTP params
  var id = getURLParameter("multiverseid");

  // get card name from HTTP params
  var name = getURLParameter("name");

  // print the name or ID under the card, prioritizing ID
  // TODO: replace this with TCGplayer info
  if (id == "null") 
  {
    $(".leftCol").append("<div>" + name + "</div>");
  } 
  else 
  {
    $(".leftCol").append("<div>" + id + "</div>");
  }
})

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}