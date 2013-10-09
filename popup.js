$(document).ready(function(){

  // Enables clicking links in the popup
  $('a').click(function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });

  var name = chrome.extension.getBackgroundPage().name;
  var id = chrome.extension.getBackgroundPage().id;

  $("#cardname").append("Name: " + name)
  $("#cardid").append("ID: " + id)

});
