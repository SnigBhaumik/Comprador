
//var canCreateFolder = false;
//var canCreateDocument = false;

if (!sessionStorage.recentTerms)
{
	sessionStorage.recentTerms = "";
}
var brdpath = new Array();

(function ($) {
	$.uniqueArray = (function (list) {
		var result = [];
		$.each(list, function(i, e) {
			if ($.inArray(e, result) == -1) result.push(e);
		});
		return result;
	})
})(jQuery);

(function ($) {
	$.toReadableDate = (function (str) {
		var dt = new Date(str.substring(0, str.length - 6));
		return dt.toLocaleString();
	})
})(jQuery);

(function ($) {
	$.toBoolean = (function (str) {
		switch(str.toLowerCase()) {
			case "true": case "yes": case "1": return true;
			case "false": case "no": case "0": case null: return false;
			default: return false;
	}})
})(jQuery);


(function ($) {
	$.bytesToSize = (function (bytes) {
		var sizes = ['Bytes', 'KB', 'MB'];
		if (bytes == 0) return 'n/a';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
	})
})(jQuery);


function extractNodeRef(noderef) {
	var ar = noderef.split("/");
	return ar[ar.length-1];
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

function loadStyle() {
	var href = "css/main.css";
	var titl = "defaultstyle";
	switch(sessionStorage.css)
	{
		case "B":
			href = "css/main-blue.css";
			titl = "bluestyle";
			break;
		case "G":
			href = "css/main-green.css";
			titl = "greenstyle";
			break;
		case "W":
			href = "css/main-brown.css";
			titl = "brownstyle";
			break;
		case "P":
			href = "css/main-prof.css";
			titl = "profstyle";
			break;
		default:
			href = "css/main.css";
			titl = "defaultstyle";
			break;
	}
    var cssLink = "<link rel='stylesheet' title='" + titl + "' type='text/css' href='" + href + "'>";

	$('link[title="bluestyle"]').remove();
	$('link[title="greenstyle"]').remove();
	$('link[title="brownstyle"]').remove();
    $("head").append(cssLink); 
}

function buildMenu() {
	$("#menupanel").html('<a class="userlink" target="_blank">User</a>&nbsp;&nbsp;<a class="browserlink" href="browser.html">Browser</a>&nbsp;&nbsp;<a class="dashboardlink" href="landing.html">Dashboard</a>&nbsp;&nbsp;<a class="reposlink" href="repos.html">Repository</a>&nbsp;&nbsp;<a class="preferenceslink" href="#preferences">Preferences</a>&nbsp;&nbsp;<a class="disconnectlink" href="index.html">Disconnect</a><input type="search" class="searchbox" style="float:right; margin-top: -5px" />');
	$("#pagefooter").html('<header><h2>Comprador</h2><p class="note">The Alfresco CMIS HTML5 CSS3 jQuery Client&nbsp;|&nbsp;<a href="https://github.com/SnigBhaumik/Comprador" target="_blank"><img src="images/github.png" height="24px" width="24px" style="vertical-align: middle; border: 0">Fork me on Github</a>&nbsp;|&nbsp;&copy;&nbsp;Snig Bhaumik 2014</p></header>');

	$(".searchbox").keypress(function(event) {
		if (event.which == 13) {
			if (event.target.value == "") {
				alert("Please enter search term.");
			}
			else {
				window.location = "search.html?kw=" + event.target.value;
			}
		}
	});

	$(".userlink").html("hello " + sessionStorage.user);
	if (sessionStorage.shareurl != "") {
		$(".userlink").attr("href", sessionStorage.shareurl + "/page/user/" + sessionStorage.user + "/profile");
	}
	else {
		$(".userlink").removeAttr("href");
	}

	$(".dashboardlink").bind("click", function() {
		setHistory("L");
	});

	$('.preferenceslink').magnificPopup({
		type: 'inline',
		src: '#preferences',
		mainClass: 'mfp-fade',
		showCloseBtn: true,
		closeBtnInside: true
	});

	$("#searchbox").keypress(function(event) {
		if (event.which == 13) {
			if (event.target.value == "") {
				alert("Please enter search term.");
			}
			else {
				search(event.target.value);
			}
		}
	});
	$('.searchbox').tipsy({
		gravity: 'ne',
		fade: true,
		fallback: 'Performs Case Sensitive Search'
	});
	$('.themeoption').bind('click', function(){
		setCompradorTheme();
	});
	$('#cachebutton').bind('click', function(){
		clearAppCache();
	});

	$('#themeoptions').tipsy({
		gravity: 'nw',
		fade: true,
		fallback: 'In some browsers you may have to refresh the page to apply the new theme.'
	});
	$('#sharelink').val(sessionStorage.shareurl);
	$('#setsharelink').tipsy({
		gravity: 'sw',
		fade: true,
		fallback: 'Clearing this Url will disable all Alfresco Share links in Comprador.'
	});
	$('#cachebutton').tipsy({
		gravity: 'sw',
		fade: true,
		fallback: 'Clears the following:'
	});
}

function buildToolbar() {
	$('.newfolder').magnificPopup({
		type: 'inline',
		src: '#newfolderdialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input',
		disableOn : function() {
			return canCreateFolder;
		},
		callbacks: {
			open: function() {
				$("#foldername").val("");
				$("#folderdesc").val("");
			}
		}
	}); 
	$('.newdocument').magnificPopup({
		type: 'inline',
		src: '#newdocdialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input',
		disableOn : function() {
			return canCreateDocument;
		},
		callbacks: {
			open: function() {
				$("#fileToUpload").val("");
				$("#filetitle").val("");
				$("#filedesc").val("");
				$("#filedropzone").css("border-style", "outset");
				$("#fileDetails").html("Please select File.");
				$("#uploadfile").attr('disabled','disabled');
			}
		}
	});
	$('.newtxtdoc').magnificPopup({
		type: 'inline',
		src: '#newtextdialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input',
		disableOn : function() {
			return canCreateDocument;
		},
		callbacks: {
			open: function() {
				$("#textfilename").val("");
				$("#textcontent").val("");
			}
		}
	});
	$('.newhtmldoc').magnificPopup({
		type: 'inline',
		src: '#newhtmldialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input',
		disableOn : function() {
			return canCreateDocument;
		},
		callbacks: {
			open: function() {
				$("#htmlfilename").val("");
				$(".jqte_editor").html("");
			}
		}
	});
	$('.folderinfo').magnificPopup({
		type: 'inline',
		src: '#folderinfodialog',
		mainClass: 'mfp-fade',
		modal : true
	});

	$('.newfolder').tipsy({
		gravity: 'se',
		fade: true,
		fallback: 'Create New Folder'
	});
	$('.newdocument').tipsy({
		gravity: 'se',
		fade: true,
		fallback: 'Upload a Document'
	});
	$('.newtxtdoc').tipsy({
		gravity: 'sw',
		fade: true,
		fallback: 'Author a new Text Document'
	});
	$('.newhtmldoc').tipsy({
		gravity: 'sw',
		fade: true,
		fallback: 'Author a new HTML Document'
	});
	$('.folderinfo').tipsy({
		gravity: 'se',
		fade: true,
		fallback: 'Folder Information'
	});

	$(".editor").jqte();
	$(".deletefolder").bind("click", function() {
		deleteObject(sessionStorage.currfolder, "F");
	});
	$(".updatefolderproperties").bind("click", function() {
		$('.folderproperties').css('display', $('.folderproperties').css('display') == "none" ? "block" : "none");
		$('#fname').focus();
	});
	$("#updatepropertiesbutton").bind("click", function() {
		updateObjectProperties(sessionStorage.currfolder, "F");
	});
}

function checkUser() {
	if (!sessionStorage.ticket || sessionStorage.ticket == "")
	{
		window.location = "index.html";
		return;
	}
	setAuthenticationTicket();
}

function checkBrowser() {
	// TODO.
}

function setAppUrl() {
	var url = $.url();
	var port = '';
	if (url.attr('port'))
	{
		port = ':' + url.attr('port');
	}
	var aurl = url.attr('protocol') + '://' + url.attr('host') + port;
	$('#serverUrl').val(aurl + '/alfresco');
	sessionStorage.shareurl = aurl + '/share';
}

function setAuthenticationTicket() {
	var encode = window.btoa || Base64.encode;
	$.ajaxSetup({
		beforeSend: function (jqXHR, settings) {
			var auth = "Basic " + encode('ROLE_TICKET:' + sessionStorage.ticket);
			jqXHR.setRequestHeader("Authorization", auth);
		}
	});
}

function loginToServer() {
	sessionStorage.alfurl = $('#serverUrl').val();
	$.ajax({
		url: sessionStorage.alfurl + '/service/api/login',
		data: JSON.stringify({username:$('#userName').val(), password:$('#password').val()}),
		contentType: 'application/json; charset=UTF-8',
		type: 'POST',
		dataType: 'json',
		processData: false,

		success: function(data) {
			sessionStorage.ticket = data.data.ticket;
			sessionStorage.user = $('#userName').val();
			setAuthenticationTicket();
			initiateCMIS();
		},

		error: function(jqXHR, textStatus, errorThrown) {
			// alert(errorThrown);
		},

		statusCode: {
			403: function() {
				abandonConnection();
			}
		}
	});
}

function abandonConnection(logout) {
	sessionStorage.ticket = null;
	sessionStorage.user = null;

	if (logout) {
		$("#resinfo").html("");
		$("#resinfo").css("display", "none");
		$("#getmein").css("display", "none");
	}
	else {
		var resinfo = "";
		resinfo = "<br/><strong>Unable to connect to the specified Respository.</strong>";
		resinfo += "<br/><strong>Some of the things you can check.</strong>";
		resinfo += "<ul><li>The server url is correct.</li>";
		resinfo += "<li>The user credential is correct.</li>";
		resinfo += "<li>Your Alfresco server is up and running.</li></ul>";
		$("#resinfo").html(resinfo);
		$("#resinfo").css("display", "block");
		$("#getmein").css("display", "none");
	}
}

function initiateCMIS() {
	$.getJSON(sessionStorage.alfurl + '/cmisbrowser', function(data) {
		var rid;
		for (var p in data)
		{
			rid = p;
		}
		for (var pp in data[rid])
		{
		}
		sessionStorage.resid = rid;
		var resinfo = "";
		resinfo = "<br/><strong>Respository Id :&nbsp;</strong>" + rid;
		resinfo += "<br/><strong>Product Version :&nbsp;</strong>" + data[rid]["productVersion"];
		resinfo += "<br/><strong>Repository Description :&nbsp;</strong>" + data[rid]["repositoryDescription"];
		resinfo += "<br/><strong>Repostory Name :&nbsp;</strong>" + data[rid]["repositoryName"];
		resinfo += "<br/><strong>Repository Url :&nbsp;</strong>" + data[rid]["repositoryUrl"];
		$("#resinfo").html("Connected to Alfresco CMIS Repository." + resinfo);
		$("#resinfo").css("display", "block");
		$("#getmein").css("display", "block");
	})

}

function showRootFolders() {
	var docroot = $.url().param("docroot");
	if (docroot && docroot != "")
	{
		if (docroot != "root")
		{
			showFolders(docroot);
			return;
		}
	}
	
	$.getJSON(sessionStorage.alfurl + '/cmisbrowser/' + sessionStorage.resid + '/root?selector=object', function(data) {
		var folders = "";
		var files = "";
		var filelist = new Array();
		for (var p in data.objects)
		{
			var obj = data.objects[p];
			if (obj.object.properties["cmis:baseTypeId"].value == "cmis:folder")
			{
				folders += "<li><a href='javascript:void(0)' onclick='showFolders(\"" + obj.object.properties["cmis:objectId"].value + "\")'><img src='images/folder-icon.png' class='folder-icon'>" + obj.object.properties["cmis:name"].value + "</a></li>";
			}
			else
			{
				filelist.push(obj.object.properties["alfcmis:nodeRef"].value);
			}
		}

		sessionStorage.currfolder = "root";
		$("#folderlist").html(folders);
		buildDocTable(filelist);
		//showBreadcrumb(objid);
	})
}

function showFolders(objid) {
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(objid) + '/descendants',
		success : function (feed) {
			var folders = "", foldercount = 0;
			var files = "", filecount = 0;
			var filelist = new Array();
			for (var i = 0; i < feed.items.length; i++)
			{
				var item = feed.items[i];
				if (item.cmisobject.baseTypeId == "cmis:folder")
				{
					folders += "<li><a href='javascript:void(0)' onclick='showFolders(\"" + item.cmisobject.objectId + "\")'><img src='images/folder-icon.png' class='folder-icon'>" + item.cmisobject.name + "</a></li>";
					foldercount++;
				}
				else
				{
					filelist.push(item.cmisobject.objectId);
					filecount++;
				}
			}
			if (foldercount > 0)
			{
				$("#folderlist").html(folders);
			}
			else
			{
				$("#folderlist").html("No sub-folders are there.<br/><br/>Use the Breadcrumb to navigate to the parent folder.");
			}
			if (filecount > 0)
			{
				buildDocTable(filelist);
			}
			else
			{
				$("#docslist").html("<tr><td>No files are there in this folder.</td></tr>");
			}

			brdpath = new Array();
			showBreadcrumb(objid);
			applyFolderAllowableActions(objid);
			sessionStorage.currfolder = objid;
		}})
}

function applyFolderAllowableActions(objid) {
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(objid) + '?includeAllowableActions=true',
		success : function (feed) {
			var item = feed.item;
			var cobj = item.cmisobject;

			var finfo = "";
			finfo += "<b>Name:</b> " + cobj.name + "<br/>";
			finfo += "<b>Title:</b> " + item.title + "<br/>";
			finfo += "<b>Description:</b> " + item.description + "</br/>";
			finfo += "<b>Created by</b> " + cobj.createdBy + " on " + $.toReadableDate(cobj.creationDate) + "<br/>";
			finfo += "<b>Last Updated by</b> " + cobj.lastModifiedBy + " on " + $.toReadableDate(cobj.lastModificationDate) + "<br/>";
			finfo += "<b>Repository Node Ref:</b> " + cobj.objectId + "<br/>";
			finfo += "<b>Folder Path:</b> " + cobj.path + "<br/><hr/>";

			finfo += "You " + (cobj.canCreateFolder ? "can" : "cannot") + " create sub-folders.<br/>";
			finfo += "You " + (cobj.canCreateDocument ? "can" : "cannot") + " create documents here.<br/>";
			finfo += "You " + (cobj.canUpdateProperties ? "can" : "cannot") + " update properties of this folder.<br/>";
			finfo += "You " + (cobj.canMoveObject ? "can" : "cannot") + " move this folder.<br/>";
			finfo += "You " + (cobj.canDeleteObject ? "can" : "cannot") + " delete this folder.<br/><hr/>";

			finfo += "<b>Tags:</b> <br/>";
			finfo += "<b>Categories:</b> <br/>";

			$('.finfo').html(finfo);
			$('#fname').val(cobj.name);
			$('#ftitle').val(item.title);
			$('#fdesc').val(item.description);
			sessionStorage.parentFolder = cobj.parentId;

			if (cobj.canCreateFolder) {
				//$(".newfolder").fadeTo('fast', 1).removeAttr('disabled');
				//$(".newfolder").attr('href', '#newfolderdialog');
				$(".newfolder").fadeTo('fast', 1).attr('href', '#newfolderdialog');
				canCreateFolder = true;
			}
			else {
				//$(".newfolder").fadeTo('fast', 0.3).prop('disabled','disabled');
				//$(".newfolder").removeAttr('href');
				$(".newfolder").fadeTo('fast', 0.3).removeAttr('href');
				canCreateFolder = false;
			}

			if (cobj.canCreateDocument) {	
				$(".newdocument").fadeTo('fast', 1).attr('href', '#newdocdialog');
				$(".newtxtdoc").fadeTo('fast', 1).attr('href', '#newtextdialog');
				$(".newhtmldoc").fadeTo('fast', 1).attr('href', '#newhtmldialog');
				canCreateDocument = true;
			}
			else {
				$(".newdocument").fadeTo('fast', 0.3).removeAttr('href');
				$(".newtxtdoc").fadeTo('fast', 0.3).removeAttr('href');
				$(".newhtmldoc").fadeTo('fast', 0.3).removeAttr('href');
				canCreateDocument = false;
			}
		}})
}

function showBreadcrumb(objid) {
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(objid),
		success : function (feed) {
			var item = feed.item;
			var tt = "<a href='javascript:void(0)' onclick='showFolders(\"" + objid + "\")'>" + feed.item.cmisobject.name + "</a>";
			brdpath.push(tt);

			if (feed.item.cmisobject.parentId)
			{
				showBreadcrumb(feed.item.cmisobject.parentId);
			}
			else
			{
				brdpath.reverse();
				$("#breadcrumb").html(brdpath.join(" &gt; "));
			}
			return tt;
		}})
}

function getSites() {
	$.getJSON(sessionStorage.alfurl + '/service/api/people/' + sessionStorage.user + '/sites', function(data) {
		var sites = "";

		for (var p in data)
		{
			var st = data[p];
			var txt = "<li><a href='browser.html?docroot=" + st.node + "'><h4><img src='images/sites-icon.png' class='folder-icon'>" + st.title + "</h4></a>";
			txt += "<div style='margin-left: 21px; margin-top: -10px'>" + st.visibility + " Site.";
			txt += "<br/><div id='nomember" + st.shortName + "'></div></div></li>";
			sites += txt;
			getSiteMembers(st.shortName);
		}
		$("#sitelist").html(sites);
	})
}

function getSiteMembers(sitename) {
	$.getJSON(sessionStorage.alfurl + '/service/api/sites/' + sitename + '/memberships', function(data) {
		$("#nomember" + sitename).html(data.length + " Member(s).");
		var m = "<div style='white-space: nowrap'>";
		for (i in data) {
			m += data[i].authority.firstName + " " + data[i].authority.lastName + " (" + data[i].role + ")<br />";
		}
		m += "</div>";
		$("#nomember" + sitename).tipsy({
			gravity: 'sw',
			fade: true,
			fallback: m,
			html: true
		});
	});
}

function getTasks() {
	$.getJSON(sessionStorage.alfurl + '/service/slingshot/dashlets/my-tasks', function(data) {
		var tasks = "";

		for (var p in data.tasks)
		{
			var tk = data.tasks[p];
			var t = tk.description != "" ? tk.description : tk.type;
			var dt = new Date(tk.dueDate.substring(0, 10));
			var txt = "";
			if (sessionStorage.shareurl != "") {
				txt += "<li><h4><img src='images/tasks-icon.png' class='folder-icon'><a href='" + sessionStorage.shareurl + "/page/task-edit?taskId=" + tk.id + "&referrer=tasks' target='_blank'>" + t + "</a></h4>";
			}
			else {
				txt += "<li><h4><img src='images/tasks-icon.png' class='folder-icon'>" + t + "</h4>";
			}
			txt += "<p style='margin-left: 21px; margin-top: -10px'>Should be completed by " + dt.toDateString() + ".";
			txt += "<br/>Task " + tk.status + ".</p>";
			if (tk.resources.length <= 0) {
			}
			else {
				txt += "<p style='margin-left: 21px; margin-top: -5px'><strong>Associated Documents</strong>";
				for (var d in tk.resources)
				{
					var dc = tk.resources[d];
					txt += "<br/><a href='doc.html?docid=" + dc.nodeRef + "&docname=" + dc.displayName + "'><img src='" + sessionStorage.alfurl + dc.icon + "' class='folder-icon'>" + dc.displayName + "</a>";
				}
			}
			txt += "</p></li>";
			tasks += txt;
		}
		$("#tasklist").html(tasks);
	})
}

function getDocs() {
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/checkedout',
		success : function (feed) {
			var files = "", filecount = 0;
			var filelist = new Array();
			for (var i = 0; i < feed.items.length; i++)
			{
				var item = feed.items[i];
				if (item.cmisobject.baseTypeId == "cmis:folder")
				{
				}
				else
				{
					files += "<li><a onclick='setHistory(\"L\")' href='doc.html?docid=" + item.cmisobject.objectId + "&docname=" + item.cmisobject.name + "'>" + item.cmisobject.name + "</a></li>";
					filecount++;
				}
			}
			if (filecount > 0) {
				$("#mydoclist").html(files);
			}
			else {
				$("#mydoclist").html("<li>No Files checked out by you.</li>");
			}
		}})
}

function buildDocTable(filelist) {
	$("#docslist").empty();
	for (var f in filelist) {
		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(filelist[f]),
			success : function (feed) {
				var item = feed.item;
				var tt = "<tr><td align='center'><img class='folder-icon-big' src='" + item.icon + "'></td>";
				tt += "<td><a onclick='setHistory(\"R\")' href='doc.html?docid=" + item.cmisobject.objectId + "&docname=" + item.cmisobject.name + "'>" + item.cmisobject.name + " (" + item.title + ")</a>";
				tt += "<br/>" + $.bytesToSize(item.cmisobject.contentStreamLength) + ".";
				tt += "<br/>Last modified by " + item.cmisobject.lastModifiedBy + " on " + $.toReadableDate(item.cmisobject.lastModificationDate);
				tt += "</td></tr>";

				$("#docslist").append(tt);
		}})}
}

function buildFoldTable(folderlist) {
	$("#docslist").empty();
	for (var f in folderlist) {
		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(folderlist[f]),
			success : function (feed) {
				var item = feed.item;
				var tt = "<tr><td align='center'><img class='folder-icon-big' src='" + item.icon + "'></td>";
				tt += "<td><a href='browser.html?docroot=" + item.cmisobject.objectId + "'>" + item.cmisobject.name + " (" + item.title + ")</a>";
				tt += "<br/>Last modified by " + item.cmisobject.lastModifiedBy + " on " + $.toReadableDate(item.cmisobject.lastModificationDate);
				tt += "</td></tr>";

				$("#docslist").append(tt);
		}})}
}

function showDocument() {
	var did = $.url().param("docid");
	var dnm = $.url().param("docname");

	$("#docheader").html(dnm);
	if (sessionStorage.histry == "R") {
		$("#goback").attr("href", "browser.html?docroot=" + sessionStorage.currfolder);
	}
	else {
		$("#goback").attr("href", "landing.html");
	}

	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, retrieving data ...' });

	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(did) + '?renditionFilter=alf:webpreview&includeAllowableActions=true',
		success : function (feed) {
			var item = feed.item;
			var cobj = item.cmisobject;

			//$("#preview").attr("src", item.cmisobject.webpreview + "?alt_ticket=" + sessionStorage.ticket);
			//$("#vidpreview").attr("src", item.cmisobject.webpreview + "?alt_ticket=" + sessionStorage.ticket);
			$("#flashvidpreview").attr("src", cobj.webpreview + "?alt_ticket=" + sessionStorage.ticket);
			$("#previewcaption").html(cobj.name);
			buildProperties(cobj.propertiesDataCMIS, cobj.propertiesDataALF, cobj.aspectsData);
			showDocVersions(did);

			/*for (var i=0; i<item.cmisobject.properties.length; i++ )
			{
				var x = item.cmisobject.properties[i];
				var p = x.firstChild ? x.firstChild.textContent : "<i>None</i>";
				$("#docproperties").append(x.attributes["displayName"].nodeValue + ": " + p + ".<br/>");
			}*/

			if (cobj.canDeleteObject)	
				$(".deletedoc").fadeTo('fast', 1).removeAttr('disabled');
			else
				$(".deletedoc").fadeTo('fast', 0.3).attr('disabled','disabled');

			/*if (cobj.canUpdateProperties) {	
			}*/
			
			
			$.msg( 'unblock' );
		}})
}

function buildProperties(propertiesCMIS, propertiesALF, aspects) {
	$('#docproperties').dataTable( {
			"aaData": propertiesCMIS,
			"aoColumns": [
				{ "sTitle": "Property", mData: "name" },
				{ "sTitle": "Value", mData: "value" }
			],
			"sPaginationType": "full_numbers"
		} );	
	$('#docalfproperties').dataTable( {
			"aaData": propertiesALF,
			"aoColumns": [
				{ "sTitle": "Property", mData: "name" },
				{ "sTitle": "Value", mData: "value" }
			],
			"sPaginationType": "full_numbers"
		} );	
	$('#docalfaspects').dataTable( {
			"aaData": aspects,
			"aoColumns": [
				{ "sTitle": "Aspect", mData: "name" }
			],
			"sPaginationType": "full_numbers"
		} );	
}

function showDocVersions(did) {
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(did) + '/versions',
		success : function (feed) {
			var versions = "";
			for (var i = 0; i < feed.items.length; i++)
			{
				var item = feed.items[i];
				var txt = "<li><strong>" + item.cmisobject.versionLabel + "</strong> - " + item.cmisobject.name + "<a href='javascript:void(0)' onclick='window.open(\"" + item.download + "?alf_ticket=" + sessionStorage.ticket + "\")'><img src='images/download.png' class='folder-icon' title='Download this version' style='float: right' /></a>";
				txt += "<p style='margin-left: 21px'>";
				if (item.cmisobject.checkinComment != "")
				{
					txt += item.cmisobject.checkinComment + "<br/>";
				}
				txt += "on " + $.toReadableDate(item.cmisobject.lastModificationDate) + " by " + item.cmisobject.lastModifiedBy +"</p></li>";
				versions += txt;
			}
			$("#docversions").html(versions);
		}})
}

function search(term) {
	var kw = "";
	if (!term)
	{
		kw = $.url().param("kw");
		if (kw == "")
		{
			return;
		}
		$("#searchbox").val(kw);
	}
	else
		kw = term;

	$("#searchheader").html("Searching keyword \"" + kw + "\"");
	var t = sessionStorage.recentTerms.split("|");
	t.push(kw);
	t = $.uniqueArray(t);
	sessionStorage.recentTerms = t.join("|");
	$("#recentterms").empty();
	for (var i in t)
	{
		if (t[i] != "")	$("#recentterms").append("<option value='" + t[i] + "'");
	}

	var qry = "";
	$.msg({ bgPath: 'images/', autoUnblock: false, clickUnblock: false, content: 'Please wait, performing search ...' });

	if ($('input:radio[name=searchoption]:checked').val() == "D") {
		qry = encodeURIComponent("SELECT * FROM cmis:document WHERE cmis:name LIKE '%" + kw + "%' OR CONTAINS ('" + kw + "')");

		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/query?q=' + qry,
			success : function (feed) {
				var files = "", filecount = 0;
				var filelist = new Array();
				for (var i = 0; i < feed.items.length; i++) {
					var item = feed.items[i];
					if (item.cmisobject.baseTypeId == "cmis:folder") {
					}
					else {
						filelist.push(item.cmisobject.objectId);
						filecount++;
					}
				}
				if (filecount > 0) {
					buildDocTable(filelist);
					$(".searchsummary").html("Search Summary");
				}
				else {
					$("#docslist").html("<tr><td>No Files found.</td></tr>");
				}
				$.msg( 'unblock' );
			},

			error: function(jqXHR, textStatus, errorThrown) {
				$.msg( 'unblock' );
				alert('Sorry, could not perform the search. Error occured:\n\n' + textStatus );
			}
			
			})
	}
	else {
		qry = encodeURIComponent("SELECT * FROM cmis:folder WHERE cmis:name LIKE '%" + kw + "%'");

		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/query?q=' + qry,
			success : function (feed) {
				var foldercount = 0;
				var folderlist = new Array();
				for (var i = 0; i < feed.items.length; i++) {
					var item = feed.items[i];
					if (item.cmisobject.baseTypeId == "cmis:folder") {
						folderlist.push(item.cmisobject.objectId);
						foldercount++;
					}
					else {
					}
				}
				if (foldercount > 0) {
					buildFoldTable(folderlist);
					$(".searchsummary").html("Search Summary");
				}
				else {
					$("#docslist").html("<tr><td>No Folders found.</td></tr>");
				}
				$.msg( 'unblock' );
			},
			
			error: function(jqXHR, textStatus, errorThrown) {
				$.msg( 'unblock' );
				alert('Sorry, could not perform the search. Error occured:\n\n' + textStatus );
			}
			
			})

	}
}

function setHistory(h) {
	sessionStorage.histry = h;
}

function setCompradorTheme() {
	var href = "css/main.css";
	var titl = "defaultstyle";
	switch($('input[name=themeoption]:radio:checked').val())
	{
		case "B":
			href = "css/main-blue.css";
			titl = "bluestyle";
			sessionStorage.css = "B";
			break;
		case "G":
			href = "css/main-green.css";
			titl = "greenstyle";
			sessionStorage.css = "G";
			break;
		case "W":
			href = "css/main-brown.css";
			titl = "brownstyle";
			sessionStorage.css = "W";
			break;
		case "P":
			href = "css/main-prof.css";
			titl = "profstyle";
			sessionStorage.css = "P";
			break;
		default:
			href = "css/main.css";
			titl = "defaultstyle";
			sessionStorage.css = "D";
			break;
	}
    var cssLink = "<link rel='stylesheet' title='" + titl + "' type='text/css' href='" + href + "'>";

	$('link[title="bluestyle"]').remove();
	//$('link[title="bluestyle"]').prop('disabled', true);
	$('link[title="greenstyle"]').remove();
	//$('link[title="greenstyle"]').prop('disabled', true);
	$('link[title="brownstyle"]').remove();
	//$('link[title="brownstyle"]').prop('disabled', true);
    $("head").append(cssLink); 

	//$.magnificPopup.close();
}

function executeQuery(qry) {
	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, executing query ...' });
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/query?q=' + encodeURIComponent(qry) + '&maxItems=100',
		success : function (feed) {

			var filecount = 0;
			var filelist = new Array();
			var foldercount = 0;
			var folderlist = new Array();
			for (var i = 0; i < feed.items.length; i++) {
				var item = feed.items[i];
				if (item.cmisobject.baseTypeId == "cmis:folder") {
					folderlist.push(item.cmisobject.objectId);
					foldercount++;
				}
				else {
					filelist.push(item.cmisobject.objectId);
					filecount++;
				}
			}

			if (filecount > 0) {
				buildDocTable(filelist);
				$(".searchsummary").html("Search Summary");	// TODO.
			}
			else if (foldercount > 0) {
				buildFoldTable(folderlist);
				$(".searchsummary").html("Search Summary");
			}
			else {
				$("#docslist").html("<tr><td>Query resulted no items.</td></tr>");
			}
			$.msg( 'unblock' );
		},

		error: function(jqXHR, textStatus, errorThrown) {
			$.msg( 'unblock' );
			alert('Sorry, could not execute the query. Error occured:\n\n' + textStatus );
		},
		
		statusCode: {
			500: function() {
				alert('Oops, Server returned Error 500.\nSomething wrong there.');
			}
		}

		})
}

function clearAppCache() {
	alert("TODO");
}

function setShareLink(mode) {
	$('#setsharelink').tipsy('hide');
	switch (mode)
	{
		case 1:
			$('#sharelink').val("");
			sessionStorage.shareurl = "";
			break;
		case 2:
			var su = sessionStorage.alfurl.replace("alfresco", "share");
			$('#sharelink').val(su);
			sessionStorage.shareurl = su;
			break;
		default:
			sessionStorage.shareurl = $.trim($('#sharelink').val());
			break;
	}
	$.magnificPopup.close();
}

function deleteObject(objid, typ) {
	var surl = "";
	if (typ == "F") {		// Means, it is a folder being Deleted.
		if (confirm("Are you sure to delete this folder?\nAll the sub-folders and subsequent contents will be deleted.\nThis action is not reversible!!!"))
			surl = sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(objid) + '/tree';
		else
			return;
	}
	else {					// Means, it is a document being Deleted.
		var did = $.url().param("docid");
		if (confirm("Are you sure to delete this document?\nThis action is not reversible!!!"))
			surl = sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(did);
		else
			return;
	}

	$.ajax({
		url: surl,
		contentType: 'application/atom+xml;type=entry',
		type: 'DELETE',
		dataType: 'xml',
		processData: false,

		success: function(data) {
			if (typ == "F") {		// Means, it is a folder being Deleted.
				$.magnificPopup.close();
				showFolders(sessionStorage.parentFolder);
			}
			else {					// Means, it is a document being Deleted.
				window.location = $("#goback").attr("href");
			}
		},

		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		}
	});	
}


function getBaseTypes() {
	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, retrieving data ...' });
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/types',
		success : function (feed) {
			var types = "", typecount = 0;
			var typelist = new Array();
			for (var i in feed.items)
			{
				var item = feed.items[i];
				var id = item.cmistype.id.replaceAll(":", "-");
				$('#baseul').append('<li id="li-' + id + '"><input type="checkbox" id="chk-' + id + '" onclick="loadTypes(\'' + id + '\')" /><label for="chk-' + id + '">' + item.title + " (" + item.cmistype.id + ')</label></li>');
			}
			$.msg( 'unblock' );
		}})
}

function loadTypes(id) {
	var cmisid = id.replaceAll("-", ":");
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/type/' + cmisid + '/children',
		success : function (feed) {
			$('#li-' + id).append('<ul id="ul-' + id + '">');

			if (feed.items.length > 0) {
				for (var i in feed.items)
				{
					var item = feed.items[i];
					var cid = item.cmistype.id.replaceAll(":", "-");
					$('#ul-' + id).append('<li id="li-' + cid + '"><input type="checkbox" id="chk-' + cid + '" onclick="loadTypes(\'' + cid + '\')" /><label for="chk-' + cid + '">' + item.title + " (" + item.cmistype.id + ')</label></li>');
				}
			}
			else {
				$('#ul-' + id).append('<li style="opacity: .6; cursor: default; font-style: italic;">No items...</li>');
			}

			$('#chk-' + id).attr("onclick", "loadType('" + id + "')");
			loadType(id);
		}})
}

function loadType(id) {
	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, retrieving data ...' });

	var cmisid = id.replaceAll("-", ":");
	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/type/' + cmisid,
		success : function (feed) {
			var ctype = feed.item.cmistype;
			$('#typedet').html("Details of Type: " + ctype.displayName);

			/*var det = "";
			det += "Id: " + ctype.id + "<br/>";
			det += "Author: " + ctype.author + "<br/>";
			det += "Local Name: " + ctype.localName + "<br/>";
			det += "Local Namespace: " + ctype.localNamespace + "<br/>";
			det += "Display Name: " + ctype.displayName + "<br/>";
			det += "Query Name: " + ctype.queryName + "<br/>";
			det += "Description: " + ctype.description + "<br/>";
			det += "Base Id: " + ctype.baseId + "<br/>";
			det += "Creatable: " + ctype.creatable + "<br/>";
			det += "Fileable: " + ctype.fileable + "<br/>";
			det += "Queryable: " + ctype.queryable + "<br/>";
			$('#typedetails').html(det);*/

			$('#typedetails').html('');
			$('#typedetails').append('<table id="tabtypedetails"></table>');
			$('#tabtypedetails').dataTable( {
					"aaData": ctype.propertiesData,
					"aoColumns": [
						{ "sTitle": "Property", mData: "name" },
						{ "sTitle": "Value", mData: "value" }
					],
					"sPaginationType": "full_numbers"
				} );
			$.msg( 'unblock' );

		}})
}


function getRepositoryInfo() {
	$.getJSON(sessionStorage.alfurl + '/cmisbrowser', function(data) {
		var rid;
		for (var p in data) {
			rid = p;
		}
		doParse(data);

		/*var resinfo = "";
		resinfo = "<br/><strong>Respository Id :&nbsp;</strong>" + rid;
		resinfo += "<br/><strong>Product Version :&nbsp;</strong>" + data[rid]["productVersion"];
		resinfo += "<br/><strong>Repository Description :&nbsp;</strong>" + data[rid]["repositoryDescription"];
		resinfo += "<br/><strong>Repostory Name :&nbsp;</strong>" + data[rid]["repositoryName"];
		resinfo += "<br/><strong>Repository Url :&nbsp;</strong>" + data[rid]["repositoryUrl"];
		$("#resinfo").html("Connected to Alfresco CMIS Repository." + resinfo);
		$("#resinfo").css("display", "block");
		$("#getmein").css("display", "block");*/
	})

}
