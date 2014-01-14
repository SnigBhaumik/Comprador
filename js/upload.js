
var content = '';
var ftype = '';
var fname = '';

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function fileSelected() {
  var file = document.getElementById('fileToUpload').files[0];
  if (file) {
    $('#fileDetails').html('Name: ' + file.name + '<br/>Size: ' + $.bytesToSize(file.size) + '<br/>Type: ' + file.type);
	ftype = file.type;
	fname = file.name;

	var reader = new FileReader();
	reader.onload = function (evt) {
		var abuff = evt.target.result;
		content = _arrayBufferToBase64(abuff);
	}
	reader.readAsArrayBuffer(file);
  }
}


function uploadFile() {
	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, uploading File ...' });

	ftype = ftype == "text/plain" ? "application/text" : ftype;
	ftype = ftype == "text/html" ? "application/html" : ftype;

	var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + fname + "</title><summary>" + fname + "</summary><content type=\"" + ftype + "\">" + content + "</content><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + fname + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + fname + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: atomentry,
		contentType: 'application/atom+xml;type=entry',
		type: 'POST',
		dataType: 'xml',
		processData: false,

		success: function(data) {
			showFolders(sessionStorage.currfolder);
			$.msg( 'unblock' );
		},

		error: function(jqXHR, textStatus, errorThrown) {
			$.msg( 'unblock' );
			alert(errorThrown);
		}

	});

	$.magnificPopup.close();
}