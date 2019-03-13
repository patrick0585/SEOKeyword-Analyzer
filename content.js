chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
	console.log("Received Message: "+message);
	if (message.action === "getKeywords") {
		extractLinks();
	}
}


function getContent(websiteData) {
	const Http = new XMLHttpRequest();

	websiteData.url = websiteData.url.replace(/^http:\/\//i, 'https://');

    Http.onloadend = (event) => {
        console.log("xhr.onloadend", event, Http.status, Http.statusText, Http.readyState, Http);
            if (event.loaded && Http.response) {
                return Http.response;
            } else {
                console.log("error"+Http.statusText);
            }
        }
    Http.open("GET", websiteData.url);
    Http.setRequestHeader("Access-Control-Allow-Origin", websiteData.url);
	Http.send();

	Http.onreadystatechange=function() {
		if (this.readyState==4 && this.status==200) {
			websiteData.domContent = Http.responseText;
			getKeywords(websiteData);
		}
	}
}

function getKeywords(websiteData) {
	if (typeof websiteData.domContent !== 'undefined') {
		var parser=new DOMParser();
  		var xmlDoc=parser.parseFromString(websiteData.domContent,"text/xml");
  		var keywords = xmlDoc.getElementsByName('keywords')[0];

  		if (typeof keywords !== 'undefined') {
  			var keywordsContent = keywords.getAttribute('content');
  			websiteData.keywords = keywordsContent;

  			delete websiteData.domContent;
  			sendData(websiteData);
  		}
	}
}

function sendData(websiteData) {
	let msg = {
        "action" : "addContent",
        "data" : websiteData
    };

	chrome.runtime.sendMessage(msg, function(response) {
  		console.log("response: "+response);
	});
}

function extractLinks() {

	let regex = '/html/body//div[contains(@class,"r")]/a[not (contains(@class, "fl"))]';
	let iterator = document.evaluate(regex, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null); 

	let thisNode;
	while( (thisNode = iterator.iterateNext()) )  {
		let h3Elm = thisNode.getElementsByTagName("h3")[0]
		if (typeof h3Elm !== 'undefined' ) {

			let nodeUrl = thisNode.href;
			getContent({
				"name" : h3Elm.outerText,
				"url" : thisNode.href
			});

		}
	}
}

