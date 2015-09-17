// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var mappedPlayers = players.map(function(p){
	var pnum = p.num;
	for(var i=0;i<playerData.length;i++){
		var pdtl = playerData[i].toLowerCase().split(",");
		if(pdtl[2]==pnum){
			var lname = pdtl[3].split(" ");
			var pname = p.name;
			if(pname.toLowerCase().indexOf(lname[0])>-1){
				p["url"] = pdtl[4]; 
				p["label"] =  pnum + " - " + pname;
				p["value"] = pnum + " - " + pname;
			}
	    }
	}  
	return p;
});
//var lastPlayer = localStorage["lastplayer"];
var lastPlayer = "";
var HnW;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    //$(window).load(function () { setTimeout(onDeviceReady, 100); });

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
       
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        //document.addEventListener( 'offline', onOffline.bind(this), false);
        //document.addEventListener( 'online', onOnline.bind(this), false);
        
        logon();

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        logon();
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
        logon();
    };
    
    function onOffline() {
      // Handle the offline event
      alert("You are offline!");
    }
	
    function onOnline() {
     // Handle the online event
     alert("You are online!");
    }
})();

function logon() {
  // check to see if the network is reachable
  $("#currop").html("checking internet access ...");
  checkConnection();
   //window.location.assign("http://dev1.insurance.ohio.gov/_forms/mlogin.aspx?ReturnUrl=%2foshiip%2fmtest%2f_layouts%2fAuthenticate.aspx%3fSource%3d%252Foshiip%252Fmtest&Source=%2Foshiip%2Fmtest");
}

function checkConnection() {
   var networkState = navigator.network.connection.type;
   var states = {};
   states[Connection.UNKNOWN]  = 'Unknown connection';
   states[Connection.ETHERNET] = 'Ethernet connection';
   states[Connection.WIFI]     = 'WiFi connection';
   states[Connection.CELL_2G]  = 'Cell 2G connection';
   states[Connection.CELL_3G]  = 'Cell 3G connection';
   states[Connection.CELL_4G]  = 'Cell 4G connection';
   states[Connection.NONE]     = 'No network connection';

   //alert('Connection type: ' + states[networkState]);
   $(".panel-body").css('height',$(window).height);
   
   if( states[networkState] == 'No network connection'){
     $(".panel-body").html("<br/><br><b style='color:red'>" +  states[networkState] + "</b>");
   } else{
     $("#currop").html("loading player data ...");
     HnW = getWindowSizes();
     setTimeout(addLookup,1500);
   }  
}   

function addLookup(){
  $(".panel-body").html("<div class='playerlookup'><span id='loadedcnt'> " + mappedPlayers.length+ " players loaded </span></div>");
  $(".playerlookup").append("<div class='newlookup'> <label>Player Lookup: </label> <input id='playerLU'/></div>");
  $(".playerlookup").append("<div id='playerDetail'><img src='images/blank.png' height='400px'/></div>");
  $("#playerLU").autocomplete({
	  minLength: 0,
	  source: mappedPlayers,
	  //focus: function(e,ui){
	//	  $("#playerLU").val(ui.item.pname);
	  //},
	  select: function(e,ui){
		  getPlayerData(ui.item);
		  $("#playerLU").val("");
		  return false;
	  }
  })
}

function getPlayerData(po){
	//$("#playerLU").val("");
	var lurl=po.url.substring(po.url.lastIndexOf("/"));
	$("#playerDetail").remove();
	$("#hidplayerData").load("players" + lurl + ".html #Content", function () {
	   
	    $(".newlookup").attr('class', 'pdlookup');
	    $("#loadedcnt").hide();
	    $(".playerlookup").append("<div id='playerDetail'> <label>" + po.name + "</label><br/></div>");
	    $("#playerDetail").append("<table class='numNpic'><tr><td class='pnumber'><span class='sharpsign'>#</span>"+po.num+"</td><td><div class='hbrk'>&nbsp; </div></td><td class='ppic'><img src='players"+lurl+".jpg' /></td></tr></table><hr style='width:75%'/>");
		$(".bio-body img").remove();
		$(".bio-body font").removeAttr('color');
		$(".bio-body font").removeAttr('face');
		$("font").removeAttr('size');
		var dtlsHTML = "<div class='playerDtls'>";
		$(".bio-body table table td").each(function(){
			dtlsHTML+=$(this).html();
		});
		dtlsHTML += "</div>";
		$(".bio-table").remove();
		$(".bio-wrap-col").remove();
		var $details = $("#Content").html();
		var ovst = $details.indexOf("verview:");
		dtlsHTML += "<hr/>" + $details.substring(ovst + 8);
		$("#playerDetail").append(dtlsHTML);
		$("#playerLU").blur();
    //localStorage['lastplayer'] =po.name;
    lastPlayer = po.name;
	});
}
function gotoschedule() {
    $(".panel-body").slideUp()
    $(".panel-schedule").slideDown();
    $("#schdbut").hide();
    $("#rostbut").show();
}
function gotolookup() {
    $(".panel-schedule").slideUp();
    $(".panel-body").slideDown();
    $("#schdbut").show();
    $("#rostbut").hide();
}
function gotoscheduleOld(){

  $(".panel-schedule").append("<div id='apiscedule'><hr/> <b>2015 Schedule</b><br/></div>");
  $("#apiscedule").append("<div id='scheduleList' >loading schedule...<br/><img src='images/loading.gif' alt='loading'/></div>");
  var schHTML = "";
  $.getJSON("http://bucifanSchedule.azure-mobile.net/api/footballseason?year=2015", function (data) {
      for (var i = 0; i < data.length; i++) {
          schHTML += "<tr data-localid='" + i + "' data-serverid='" + data[i].id + "' ><td>" + data[i].GameDateTime + "</td><td>" + data[i].Opponet + "</td><td>" + data[i].Location + "</td></tr>";
      }
      $("#scheduleList").html("<table>" + schHTML + "</table> <br/> done.");
    });
  
  
// getWindowSizes();

}

function getWindowSizes() {
  var windowHeight = 0, windowWidth = 0;
  if (typeof (window.innerWidth) == 'number') {
      windowHeight = window.innerHeight;
      windowWidth = window.innerWidth;
      
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
      windowHeight = document.documentElement.clientHeight;
      windowWidth = document.documentElement.clientWidth;
      
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
     windowHeight = document.body.clientHeight;
     windowWidth = document.body.clientWidth;
  }
  
   $(".playerDetail").append(" <b> height: " + windowHeight + " - width: " +windowWidth + "</b><br/>");
}