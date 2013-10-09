// global accessors for card name and ID
var name = "null"
var id = "null"

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the tabs url starts with "http://specificsite.com"...
  var str = "http://gatherer.wizards.com/pages/card"
  if (tab.url.toLowerCase().indexOf(str) == 0) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Listen for messages from Content containing cardinfo
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cardinfo)
    {
      name = request.cardinfo.cardname;
      id = request.cardinfo.cardid;
    }
});