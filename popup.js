$(document).ready(function(){

  // Enables clicking links in the popup
  $('a').click(function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });

  var name = chrome.extension.getBackgroundPage().name;
  var set = chrome.extension.getBackgroundPage().set;
  
  $("#cardname").append("Name: " + name)
  $("#cardset").append("Set: " + set)

});
