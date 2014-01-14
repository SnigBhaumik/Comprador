
sessionStorage.alfUrl = "";
//sessionStorage.histry = "";
//sessionStorage.currfolder = "root";
if (!sessionStorage.recentTerms)
{
	sessionStorage.recentTerms = "";
}
var brdpath = new Array();

(function($) {
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }) (window.location.search.substr(1).split('&'))
})(jQuery);


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


function loadStyle()
{
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
	$("#menupanel").html('<a class="repositorylink" href="repository.html">Repository</a>&nbsp;&nbsp;<a class="dashboardlink" href="landing.html">Dashboard</a>&nbsp;&nbsp;<a class="preferenceslink" href="#preferences">Preferences</a>&nbsp;&nbsp;<a class="disconnectlink" href="index.html">Disconnect</a><input type="search" class="searchbox" style="float:right; margin-top: -5px" />');
	$("#pagefooter").html('<header><h2>Comprador</h2><p class="note">The Alfresco CMIS HTML5 CSS3 Client&nbsp;|&nbsp;<a href="https://github.com/SnigBhaumik/Comprador" target="_blank"><img src="images/github.png" height="24px" width="24px" style="vertical-align: middle; border: 0">Fork me on Github</a>&nbsp;|&nbsp;&copy;&nbsp;Snig Bhaumik 2013</p></header>');

	$(".searchbox").keypress(function(event) {
		if (event.which == 13)
		{
			if (event.target.value == "")
			{
				alert("Please enter search term.");
			}
			else
			{
				window.location = "search.html?kw=" + event.target.value;
			}
		}
	});
	
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
		if (event.which == 13)
		{
			if (event.target.value == "")
			{
				alert("Please enter search term.");
			}
			else
			{
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
}

function buildToolbar() {
	$('.newfolder').magnificPopup({
		type: 'inline',
		src: '#newfolderdialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input'
	});
	$('.newdocument').magnificPopup({
		type: 'inline',
		src: '#newdocdialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input'
	});
	$('.newtxtdoc').magnificPopup({
		type: 'inline',
		src: '#newtextdialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input'
	});
	$('.newhtmldoc').magnificPopup({
		type: 'inline',
		src: '#newhtmldialog',
		mainClass: 'mfp-fade',
		modal : true, 
		focus : 'input'
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

	$(".editor").jqte();
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

function setAuthenticationTicket() {
	var encode = window.btoa || Base64.encode;
	$.ajaxSetup({
		beforeSend: function (jqXHR, settings) {
			var auth = "Basic " + encode('ROLE_TICKET:' + sessionStorage.ticket);
			jqXHR.setRequestHeader("Authorization", auth);
			}
	});
}

window.test = function(d) {
	alert(d);
}

function loginToServer_remote() {
	sessionStorage.alfurl = $('#serverUrl').val();
	$.ajax({
		url: sessionStorage.alfurl + '/service/api/login.json?u=' + $('#userName').val() + '&pw=' + $('#password').val(),
		contentType: "application/json; charset=utf-8",
		dataType: 'jsonp',
		jsonpCallback: 'test',
		jsonp: 'alf_callback',

		//success: test,

		error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},

		statusCode: {
			403: function() {
				abandonConnection();
			}
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

	if (logout)
	{
		$("#resinfo").html("");
		$("#resinfo").css("display", "none");
		$("#getmein").css("display", "none");
	}
	else
	{
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
	var docroot = $.QueryString["docroot"];
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
			sessionStorage.currfolder = objid;
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
			var txt = "<li><a href='repository.html?docroot=" + st.node + "'><h4><img src='images/sites-icon.png' class='folder-icon'>" + st.title + "</h4></a>";
			txt += "<div style='margin-left: 21px; margin-top: -10px'>" + st.visibility + " Site.";
			txt += "<br/><div id='nomember" + st.shortName + "' style='white-space: nowrap'></div></div></li>";
			sites += txt;
			getSiteMembers(st.shortName);
		}
		$("#sitelist").html(sites);
	})
}

function getSiteMembers(sitename) {
	$.getJSON(sessionStorage.alfurl + '/service/api/sites/' + sitename + '/memberships', function(data) {
		$("#nomember" + sitename).html(data.length + " Member(s).");
		var m = "";
		for (i in data) {
			m += data[i].authority.firstName + " " + data[i].authority.lastName + " (" + data[i].role + ")<br />";
		}
		$("#nomember" + sitename).tipsy({
			gravity: 'w',
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
			var txt = "<li><h4><img src='images/tasks-icon.png' class='folder-icon'>" + tk.description + "</h4>";
			txt += "<p style='margin-left: 21px; margin-top: -10px'>Should be completed by " + tk.dueDate + ".";
			txt += "<br/>Task " + tk.status + ".</p>";
			txt += "<p style='margin-left: 21px; margin-top: -5px'><strong>Associated Documents</strong>";
			for (var d in tk.resources)
			{
				var dc = tk.resources[d];
				txt += "<br/><a href='doc.html?docid=" + dc.nodeRef + "&docname=" + dc.displayName + "'><img src='" + sessionStorage.alfurl + dc.icon + "' class='folder-icon'>" + dc.displayName + "</a>";
			}
			txt += "</p></li>";
			tasks += txt;
		}
		$("#tasklist").html(tasks);
	})
}

function buildDocTable(filelist) {
	$("#docslist").empty();
	for (var f in filelist) {
		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(filelist[f]),
			success : function (feed) {
				var item = feed.item;
				var tt = "<tr><td align='center'><img class='folder-icon-big' src='" + item.icon + "'></td>";
				tt += "<td><a onclick='setHistory(\"R\")' href='doc.html?docid=" + item.cmisobject.objectId + "&docname=" + item.cmisobject.name + "' class='open-popup-link'>" + item.cmisobject.name + " (" + item.title + ")</a>";
				tt += "<br/>" + $.bytesToSize(item.cmisobject.contentStreamLength) + ".";
				tt += "<br/>Last modified by " + item.cmisobject.lastModifiedBy + " on " + item.cmisobject.lastModificationDate;
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
				tt += "<td><a href='repository.html?docroot=" + item.cmisobject.objectId + "'>" + item.cmisobject.name + " (" + item.title + ")</a>";
				tt += "<br/>Last modified by " + item.cmisobject.lastModifiedBy + " on " + item.cmisobject.lastModificationDate;
				tt += "</td></tr>";

				$("#docslist").append(tt);
		}})}
}

function showDocument() {
	var did = $.QueryString["docid"];
	var dnm = $.QueryString["docname"];
	$("#docheader").html(dnm);
	if (sessionStorage.histry == "R") {
		$("#goback").attr("href", "repository.html?docroot=" + sessionStorage.currfolder);
	}
	else {
		$("#goback").attr("href", "landing.html");
	}

	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, retrieving data ...' });

	$.getFeed ({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(did) + '?renditionFilter=alf:webpreview',
		success : function (feed) {
			var item = feed.item;

			//$("#preview").attr("src", item.cmisobject.webpreview + "?alt_ticket=" + sessionStorage.ticket);
			//$("#vidpreview").attr("src", item.cmisobject.webpreview + "?alt_ticket=" + sessionStorage.ticket);
			$("#flashvidpreview").attr("src", item.cmisobject.webpreview + "?alt_ticket=" + sessionStorage.ticket);
			$("#previewcaption").html(item.cmisobject.name);
			buildProperties(item.cmisobject.propertiesDataCMIS, item.cmisobject.propertiesDataALF, item.cmisobject.aspectsData);
			showDocVersions(did);

			/*for (var i=0; i<item.cmisobject.properties.length; i++ )
			{
				var x = item.cmisobject.properties[i];
				var p = x.firstChild ? x.firstChild.textContent : "<i>None</i>";
				$("#docproperties").append(x.attributes["displayName"].nodeValue + ": " + p + ".<br/>");
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
				txt += "on " + item.cmisobject.lastModificationDate + " by " + item.cmisobject.lastModifiedBy +"</p></li>";
				versions += txt;
			}
			$("#docversions").html(versions);
		}})
}

function search(term) {
	var kw = "";
	if (!term)
	{
		kw = $.QueryString["kw"];
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
		default:
			href = "css/main.css";
			titl = "defaultstyle";
			sessionStorage.css = "D";
			break;
	}
    var cssLink = "<link rel='stylesheet' title='" + titl + "' type='text/css' href='" + href + "'>";

	//$('link[title="bluestyle"]').remove();
	$('link[title="bluestyle"]').prop('disabled', true);
	//$('link[title="greenstyle"]').remove();
	$('link[title="greenstyle"]').prop('disabled', true);
	//$('link[title="brownstyle"]').remove();
	$('link[title="brownstyle"]').prop('disabled', true);
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

function createnewFolder() {
	var nm = $.trim($("#foldername").val());
	var desc = $.trim($("#folderdesc").val());
	if (nm == "") {
		alert("Please enter Folder Name.");
		return;
	}

	var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + nm + "</title><summary>" + desc + "</summary><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:folder</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:folder</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + $.trim($("#foldername").val()) + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + $.trim($("#foldername").val()) + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: atomentry,
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
	var nm = $.trim($("#textfilename").val()) + ".txt";
	var desc = nm;
	var content = Base64.encode($("#textcontent").val());

	var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + nm + "</title><summary>" + desc + "</summary><content type=\"application/text\">" + content + "</content><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: atomentry,
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
	var nm = $.trim($("#htmlfilename").val()) + ".html";
	var desc = nm;
	var content = Base64.encode($("#htmlcontent").val());

	var atomentry = "<?xml version='1.0' encoding='utf-8'?><entry xmlns=\"http://www.w3.org/2005/Atom\" xmlns:app=\"http://www.w3.org/2007/app\" xmlns:cmis=\"http://docs.oasis-open.org/ns/cmis/core/200908/\" xmlns:cmisra=\"http://docs.oasis-open.org/ns/cmis/restatom/200908/\" xmlns:alf=\"http://www.alfresco.org\"><title>" + nm + "</title><summary>" + desc + "</summary><content type=\"application/html\">" + content + "</content><cmisra:object><cmis:properties><cmis:propertyId propertyDefinitionId=\"cmis:objectTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyId propertyDefinitionId=\"cmis:baseTypeId\"><cmis:value>cmis:document</cmis:value></cmis:propertyId><cmis:propertyString propertyDefinitionId=\"cmis:name\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString><cmis:propertyString propertyDefinitionId=\"cm:title\"><cmis:value>" + nm + "</cmis:value></cmis:propertyString></cmis:properties></cmisra:object></entry>";

	$.ajax({
		url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(sessionStorage.currfolder) + '/children',
		data: atomentry,
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

