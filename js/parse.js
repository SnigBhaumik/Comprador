
function escapeHTML(str)
{
   //code portion borrowed from prototype library
   var div = document.createElement('div');
   var text = document.createTextNode(str);
   div.appendChild(text);
   return div.innerHTML;
   //end portion
}

function wordwrap(str)
{
   parts = str.split(" ");

   for(i = 0; i < parts.length; i++)
   {
      if(parts[i].length <= 30) continue;

      t = parts[i].length;
      p = "";

      for(var j = 0; j < (parts[i].length - 30); j += 30) p += parts[i].substring(j, j + 30) + "<wbr />";
      parts[i] = p + parts[i].substring(j, parts[i].length);
   }

   return parts.join(" ");
}

var elementCount = 0;
var arrayCount = 0;
var objectCount = 0;
var nestingLevel = 0;


function parseValue(val, parent, level)
{
   elementCount++;
   if(parent == null) parent = "";
   if(level == null) level = 1;

   if(typeof(val) == "object")
   {
      if(level > nestingLevel) nestingLevel = level;
      if(val instanceof Array)
      {
         arrayCount++;
         parent = parent + (parent != "" ? " > " : "") + "Array (" + val.length + " item" + (val.length != 1 ? "s)" : ")");

         var out = "<div class='wrap'>\n<div class='array' onmouseover='doFocus(event, this);'>\n<div class='widgets'><img src='images/min.gif' onclick='hideChild(this);' /></div>\n<h3><span class='titled' title='" + parent + "'>Array</span></h3>\n";

         if(val.length > 0)
         {
            out += "<table class='arraytable'>\n<tr><th>Index</th><th>Value</th></tr>\n";
            
            for(prop in val)
            {
               if(typeof(val[prop]) == "function") continue;
               out += "<tr><td>" + prop + "</td><td>" + parseValue(val[prop], parent, level + 1) + "</td></tr>\n";
            }
            
            out += "</table>\n";
         }
         else
         {
            
            return "(empty <span class='titled' title='" + parent + "'>Array</span>)\n";
         }
         
         out += "</div>\n</div>\n";
         return out;
      }
      else
      {
         objectCount++;
         i = 0;
         for(prop in val)
         {
            if(typeof(val[prop]) != "function") i++;
         }

         parent = parent + (parent != "" ? " > " : "") + "Object (" + i + " item" + (i != 1 ? "s)" : ")");

         var out = "<div class='wrap'>\n<div class='object' onmouseover='doFocus(event, this);'>\n<div class='widgets'><img src='images/min.gif' onclick='hideChild(this);' /></div>\n<h3><span class='titled' title='" + parent + "'>Object</span></h3>\n";
         
         if(i > 0)
         {
            out += "<table class='objecttable'>\n<tr><th>Name</th><th>Value</th></tr>\n";
            for(prop in val)
            {
               if(typeof(val[prop]) == "function") continue;
               out += "<tr><td>" + prop + "</td><td>" + parseValue(val[prop], parent, level + 1) + "</td></tr>\n";
            }
            
            out += "</table><div class='clear'></div>\n";
         }
         else
         {
            return "(empty <span class='titled' title='" + parent + "'>Object</span>)\n";
         }
         
         out += "</div>\n</div>\n";
         return out;
      }
   }
   else
   {
      if(typeof(val) == "string") return "<span class='string'>" + wordwrap(val.replace(/\n/g, "<br />")) + "</span>";
      else if(typeof(val) == "number") return "<span class='number'>" + val + "</span>";
      else if(typeof(val) == "boolean") return "<span class='boolean'>" + val + "</span>";
      else return "<span class='void'>(null)</span>";
   }
}

function parse(str)
{
   elementCount = 0;
   arrayCount = 0;
   objectCount = 0;

   var obj = null;
   try
   {
	  obj = str;
   }
   catch(e)
   {
      if(e instanceof SyntaxError)
      {
         alert("There was a syntax error in your JSON string.\n" + e.message + "\nPlease check your syntax and try again.");
         $("#text").focus();
         return;
      }

      alert("There was an unknown error. Perhaps the JSON string contained a deep level of nesting.");
      $("#text").focus();
      return
   }

   return parseValue(obj, null, null);
}

function doParse(str)
{
	var result = parse(str, null);
	if(result != null) $("#output").html(result);
}


function hideChild(ele)
{
   var src = ele.src + "";
   var minimizing = (src.indexOf("min.gif") != -1);

   var nodes = ele.parentNode.parentNode.childNodes;
   for(i = 0; i < nodes.length; i++)
   {
      if(nodes[i].tagName == "TABLE")
      {
         nodes[i].style.display = (minimizing ? "none" : "");

         ele.parentNode.parentNode.style.paddingRight = (minimizing ? "2.0em" : "1.5em");
         ele.parentNode.style.right = (minimizing ? "1em" : "1.5em");

         ele.src = (minimizing ? "images/max.gif" : "images/min.gif");

         return;
      }
   }
}

var currentlyFocused = null;
function doFocus(event, ele)
{
   if(currentlyFocused != null) currentlyFocused.style.border = "1px dotted #000000";
   ele.style.border = "1px dotted #ffa000";

   currentlyFocused = ele;

   if(!event) event = window.event;
   event.cancelBubble = true;
   if(event.stopPropagation) event.stopPropagation();
}

function stopFocus()
{
   if(currentlyFocused != null) currentlyFocused.style.border = "1px dotted #000000";
}

