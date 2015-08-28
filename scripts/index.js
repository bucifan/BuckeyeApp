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
        HnW = getWindowSizes();
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
     setTimeout(addLookup,1500);
   }  
}   

function addLookup(){
  $(".panel-body").html("<div class='playerlookup'> " + mappedPlayers.length+ " players loaded </div>");
  $(".playerlookup").append("<div> <label>Player Lookup:</label><br/><input id='playerLU'/></div>");
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
	$("#hidplayerData").load("players"+lurl+".html #Content", function(){
		$(".playerlookup").append("<div id='playerDetail'> <label>"+po.name+"</label><br/></div>");
		$("#playerDetail").append("<img src='players"+lurl+".jpg' />");
		$(".bio-body img").remove();
		$(".bio-body font").removeAttr('color');
		$(".bio-body font").removeAttr('face');
		var dtlsHTML = "<div class='playerDtls'>";
		$(".bio-body table table td").each(function(){
			dtlsHTML+=$(this).html();
		});
		dtlsHTML+="</div>";
		$("#playerDetail").append(dtlsHTML);
		$("#playerLU").blur();
    //localStorage['lastplayer'] =po.name;
    lastPlayer = po.name;
	});
}

function gotoschedule(){
  $("#playerDetail").remove();
  $(".playerlookup").append("<div id='playerDetail'> <label>"+lastPlayer+"</label><br/></div>");
  $(".playerDetail").append(" <b>" + HnW[0] + " - " + HnW[1] + "</b><br/>");
  $(".playerDetail").append(" <b>" + window.height + "</b><br/>");
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
  return [windowWidth, windowHeight];
}