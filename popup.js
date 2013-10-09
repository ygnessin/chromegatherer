$(document).ready(function(){
   $('a').click(function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});