chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
	updateView(message.data);
}

function updateView(data) {

  console.log(data);

  var tableRef = document.getElementById('resultTbl').getElementsByTagName('tbody')[0];

    // Insert a row in the table at the last row
    var newRow   = tableRef.insertRow(tableRef.rows.length);

    var cell_name  = newRow.insertCell(0);
    var cell_url  = newRow.insertCell(1);
    var cell_keywords  = newRow.insertCell(2);

    cell_name.innerHTML = data.name;
    cell_url.innerHTML = data.url;
    cell_keywords.innerHTML = data.keywords;


    document.getElementById('resultTbl').style.display = null;
  }



  document.addEventListener('DOMContentLoaded', function() {

    let params = {
      active : true
    };

    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
      let msg = {
        "action" : "getKeywords"
      };
      console.log("Tab-ID: "+tabs[0].id);

      chrome.tabs.sendMessage(tabs[0].id, msg);
    }
  });
