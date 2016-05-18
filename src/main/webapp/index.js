// index.js

// request message on server
//Calls SimpleServlet to get the "Hello World" message
xhrGet("SimpleServlet", function(responseText){
	// add to document
	var mytitle = document.getElementById('message');
	mytitle.innerHTML = responseText;

}, function(err){
	console.log(err);
});

//utilities
function createXHR(){
	if(typeof XMLHttpRequest != 'undefined'){
		return new XMLHttpRequest();
	}else{
		try{
			return new ActiveXObject('Msxml2.XMLHTTP');
		}catch(e){
			try{
				return new ActiveXObject('Microsoft.XMLHTTP');
			}catch(e){}
		}
	}
	return null;
}
function xhrGet(url, callback, errback){
	var xhr = new createXHR();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				callback(xhr.responseText);
			}else{
				errback('service not available');
			}
		}
	};
	xhr.timeout = 3000;
	xhr.ontimeout = errback;
	xhr.send();
}

function xhrAttach(url, data, callback, errback)
{
	var xhr = new createXHR();
	xhr.open("POST", url, true);
	//xhr.setRequestHeader("Content-type", "multipart/form-data");
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				callback(parseJson(xhr.responseText));
			}else{
				errback("Error: "+xhr.responseText);
			}
		}
	};
	xhr.timeout = 1000000;
	xhr.ontimeout = errback;
	xhr.send(data);
}

function uploadFile(node)
{
	
	var file = node.previousSibling.files[0];
	//if file not selected, throw error
	if(!file)
	{
		alert("File not selected for upload... \t\t\t\t \n\n - Choose a file to upload. \n - Then click on Upload button.");
		return;
	}
	
	var row = node.parentNode.parentNode;
	
	var form = new FormData();
	form.append("file", file);
	
	var id = row.getAttribute('data-id');

	var queryParams = (id == null) ? "" : "id=" + id;
	queryParams+= "&name="+row.firstChild.firstChild.value;
	queryParams+="&value="+row.firstChild.nextSibling.firstChild.firstChild.firstChild.firstChild.firstChild.value;
	queryParams+= "&filename="+file.name;
	
	//var table = row.firstChild.nextSibling.firstChild;	
	//var newRow = addNewRow(table);	
	
	//startProgressIndicator(newRow);
	
	xhrAttach("/attach?"+queryParams, form, function(item){
		console.log('attached: ', item);
		//row.setAttribute('data-id', item.id);
		//removeProgressIndicator(row);
		//setRowContent(item, row);
	}, function(err){
		console.log(err);
		//stop showing loading message
		//stopLoadingMessage();
		//document.getElementById('errorDiv').innerHTML = err;
	});
	
}

function parseJson(str){
	return window.JSON ? JSON.parse(str) : eval('(' + str + ')');
}
function prettyJson(str){
	// If browser does not have JSON utilities, just print the raw string value.
	return window.JSON ? JSON.stringify(JSON.parse(str), null, '  ') : str;
}

