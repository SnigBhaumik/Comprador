
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

function createnewFolder() {
	var nm = $.trim($("#foldername").val());
	var desc = $.trim($("#folderdesc").val());
	if (nm == "") {
		alert("Please enter Folder Name.");
		return;
	}

	var a = $.atomEntry({
		baseTypeId: 'cmis:folder',
		objectTypeId: 'cmis:folder',
		name: nm,
		title: nm,
		summary: desc,
		description: desc
	});

	//var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + nm + "</title><summary>" + desc + "</summary><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:folder</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:folder</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + $.trim($("#foldername").val()) + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + $.trim($("#foldername").val()) + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: a.entryXML,
		contentType: 'application/atom+xml;type=entry',
		type: 'POST',
		dataType: 'xml',
		processData: false,

		success: function(data) {
			showFolders(sessionStorage.currfolder);
		},

		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}

	});

	$.magnificPopup.close();
}

function createnewTextFile()
{
	var nm = $.trim($("#textfilename").val());
	if (nm == "")
	{
		alert("Please enter file name.");
		return;
	}
	nm += ".txt";
	var desc = nm;
	var textcontent = Base64.encode($("#textcontent").val());

	var a = $.atomEntry({
		baseTypeId: 'cmis:document',
		objectTypeId: 'cmis:document',
		name: nm,
		title: nm,
		summary: desc,
		description: desc,
		contenttype: 'application/text',
		content: textcontent
	});

	//var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + nm + "</title><summary>" + desc + "</summary><content type=\"application/text\">" + content + "</content><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: a.entryXML,
		contentType: 'application/atom+xml;type=entry',
		type: 'POST',
		dataType: 'xml',
		processData: false,

		success: function(data) {
			showFolders(sessionStorage.currfolder);
		},

		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}

	});

	$.magnificPopup.close();

}

function createnewHTMLFile()
{
	var nm = $.trim($("#htmlfilename").val());
	if (nm == "")
	{
		alert("Please enter file name.");
		return;
	}
	nm += ".html";
	var desc = nm;
	var htmlcontent = Base64.encode($("#htmlcontent").val());

	var a = $.atomEntry({
		baseTypeId: 'cmis:document',
		objectTypeId: 'cmis:document',
		name: nm,
		title: nm,
		summary: desc,
		description: desc,
		contenttype: 'application/html',
		content: htmlcontent
	});

	//var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + nm + "</title><summary>" + desc + "</summary><content type=\"application/html\">" + content + "</content><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: a.entryXML,
		contentType: 'application/atom+xml;type=entry',
		type: 'POST',
		dataType: 'xml',
		processData: false,

		success: function(data) {
			showFolders(sessionStorage.currfolder);
		},

		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}

	});

	$.magnificPopup.close();
}

function updateObjectProperties(objid, type) {
	var n = $.trim($('#fname').val());
	var t = $.trim($('#ftitle').val());
	var d = $.trim($('#fdesc').val());

	var a = $.atomEntry({
		name: n,
		title: t,
		summary: d,
		description: d
	});

	//var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><summary>" + d + "</summary><cmisra:object><cmis:properties><alf:aspects><alf:properties><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + t + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:description\"><cmis:value>" + d + "</cmis:value></cmis:propertyString></alf:properties></alf:aspects></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder),
		data: a.entryXML,
		contentType: 'application/atom+xml;type=entry',
		type: 'PUT',
		dataType: 'xml',
		processData: false,

		success: function(data) {
			$('.folderproperties').css('display','none');
			applyFolderAllowableActions(objid);
		},

		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});
}

function fileSelected(f) {
	var file = null;
	if (f) {
		file = f[0];
	}
	else {
		file = document.getElementById('fileToUpload').files[0];
	}
  
	if (file) {
		$('#fileDetails').html('');

		var imageType = /image.*/;
    
		if (file.type.match(imageType)) {
			var img = document.createElement("img");
			img.classList.add("uploadpreview");
			img.file = file;
			$('#fileDetails').append(img);
			
			var reader = new FileReader();
			reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
			reader.readAsDataURL(file);
		}

		$('#fileDetails').append('<div>' + file.name + '<br/>' + $.bytesToSize(file.size) + '<br/>' + file.type);
		$('#filetitle').val(file.name);
		ftype = file.type;
		fname = file.name;

		var reader = new FileReader();
		reader.onload = function (evt) {
			var abuff = evt.target.result;
			content = _arrayBufferToBase64(abuff);
	}
	reader.readAsArrayBuffer(file);
	$("#uploadfile").removeAttr('disabled');
  }
}


function uploadFile() {
	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, uploading File ...' });

	ftype = ftype == "text/plain" ? "application/text" : ftype;
	ftype = ftype == "text/html" ? "application/html" : ftype;

	var a = $.atomEntry({
		baseTypeId: 'cmis:document',
		objectTypeId: 'cmis:document',
		name: fname,
		title: $.trim($('#filetitle').val()),
		summary: $('#filedesc').val(),
		description: $('#filedesc').val(),
		contenttype: ftype,
		content: content
	});

	//var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + fname + "</title><summary>" + $('#filedesc').val() + "</summary><content type=\"" + ftype + "\">" + content + "</content><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + fname + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + $('#filetitle').val() + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: a.entryXML,
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
