
sessionStorage.alfUrl = "";
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
    })(window.location.search.substr(1).split('&'))
})(jQuery);


function buildMenu() {
	$("#menupanel").html('<a class="repositorylink" href="repository.html">Repository</a>&nbsp;&nbsp;<a class="dashboardlink" href="landing.html">Dashboard</a>&nbsp;&nbsp;<a class="disconnectlink" href="index.html">Disconnect</a><input type="search" class="searchbox" style="float:right" />');
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
}

function extractNodeRef(noderef) {
	return noderef.split("/")[3];
}

function checkUser()
{
	if (!sessionStorage.ticket || sessionStorage.ticket == "")
	{
		window.location = "index.html";
		return;
	}
	setAuthenticationTicket();
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

		/*error: function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown);
		},*/

		statusCode: {
			403: function() {
				abandonConnection();
			}
		}
	})
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
				filelist.push(obj.object.properties["cmis:objectId"].value);
			}
		}

		$("#folderlist").html(folders);
		buildDocTable(filelist);
		//$("#rightpanel").html(files);
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
				$("#folderlist").html("No sub-folders are there.<br/>Use the Breadcrumb to navigate to the parent folder.");
			}
			if (filecount > 0)
			{
				buildDocTable(filelist);
			}
			else
			{
				//$("#rightpanel").html("No files are there in this folder.");
			}

			brdpath = new Array();
			showBreadcrumb(objid);
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
			var txt = "<li><h4><img src='images/sites-icon.png' class='folder-icon'>" + st.title + "</h4>";
			txt += "<p style='margin-left: 21px'>" + st.visibility + " Site.";
			txt += "<br/>" + getSiteMembers(st.shortName) + " Members.</p></li>";
			sites += txt;
		}
		$("#sitelist").html(sites);
	})
}

function getSiteMembers(sitename) {
	$.getJSON(sessionStorage.alfurl + '/service/api/sites/' + sitename + '/memberships', function(data) {
		return data.length;
	});
}

function getTasks() {
	$.getJSON(sessionStorage.alfurl + '/service/slingshot/dashlets/my-tasks', function(data) {
		var tasks = "";

		for (var p in data.tasks)
		{
			var tk = data.tasks[p];
			var txt = "<li><h4><img src='images/tasks-icon.png' class='folder-icon'>" + tk.description + "</h4>";
			txt += "<p style='margin-left: 21px'>Should be completed by " + tk.dueDate + ".";
			txt += "<br/>Task " + tk.status + ".</p>";
			txt += "<p style='margin-left: 21px'><strong>Associated Documents</strong>";
			for (var d in tk.resources)
			{
				var dc = tk.resources[d];
				txt += "<br/><img src='" + sessionStorage.alfurl + dc.icon + "' class='folder-icon'>" + dc.displayName;
			}
			txt += "</p></li>";
			tasks += txt;
		}
		$("#tasklist").html(tasks);
	})
}

function buildDocTable(filelist) {
	$("#docslist").empty();

	for (var f in filelist)
	{
		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/i/' + extractNodeRef(filelist[f]),
			success : function (feed) {
				var item = feed.item;
				//alert(item.cmisobject.name);
				var tt = "<tr><td>";
				tt += "<a href='doc.html?docid=" + item.cmisobject.objectId + "&docname=" + item.cmisobject.name + "' class='open-popup-link'><img class='folder-icon-big' src='" + item.icon + "'>" + item.cmisobject.name + " (" + item.title + ")</a>";
				tt += "<br/>" + item.cmisobject.contentStreamLength + " bytes.";
				tt += "<br/>Last modified by " + item.cmisobject.lastModifiedBy + " on " + item.cmisobject.lastModificationDate;
				tt += "</td></tr>";

				$("#docslist").append(tt);

				/*$('.open-popup-link').magnificPopup({
					type: 'iframe',
					iframe: {
						patterns: {
						}
					}
				});*/
		}})}
}

function showDocument() {
	var did = $.QueryString["docid"];
	var dnm = $.QueryString["docname"];
	$("#docheader").html(dnm);
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

	var qry = "";
	$.msg({ bgPath : 'images/', autoUnblock : false, clickUnblock : false, content : 'Please wait, performing search ...' });

	if ($('input:radio[name=searchoption]:checked').val() == "D")
	{
		qry = encodeURIComponent("SELECT * FROM cmis:document WHERE cmis:name LIKE '%" + kw + "%' OR CONTAINS ('" + kw + "')");

		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/query?q=' + qry,
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
						filelist.push(item.cmisobject.objectId);
						filecount++;
					}
				}
				if (filecount > 0)
				{
					//$("#rightpanel").html(files);
					buildDocTable(filelist);
					$(".searchsummary").html("Search Summary");
					$.msg( 'unblock' );
				}
				else
				{
					//$("#rightpanel").html("No files are there in this folder.");
				}
				
				
			}})
	}
	else
	{

		qry = encodeURIComponent("SELECT * FROM cmis:folder WHERE cmis:name LIKE '%" + kw + "%'");

		$.getFeed ({
			url: sessionStorage.alfurl + '/service/cmis/query?q=' + qry,
			success : function (feed) {

				var foldercount = 0;
				var folderlist = new Array();
				for (var i = 0; i < feed.items.length; i++)
				{
					var item = feed.items[i];
					if (item.cmisobject.baseTypeId == "cmis:folder")
					{
						folderlist.push(item.cmisobject.objectId);
						foldercount++;
					}
					else
					{
					}
				}
				if (foldercount > 0)
				{
					//$("#rightpanel").html(files);
					buildDocTable(folderlist);
					$(".searchsummary").html("Search Summary");
					$.msg( 'unblock' );
				}
				else
				{
					//$("#rightpanel").html("No files are there in this folder.");
				}
				
				
			}})

	}
	

}