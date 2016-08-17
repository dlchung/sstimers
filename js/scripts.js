//
// LEAFLET JS
//

var map = L.map('mapid', {
	crs: L.CRS.Simple,
	minZoom: 0,
	maxZoom: 1,
});

var bounds = [[0,0], [1938,1762]];
var image = L.imageOverlay('images/map_v1.jpg', bounds).addTo(map);
var markerData;
var popupContent;
var popupOptions;
var toolTipSettings = {permanent: true, direction: 'top', opacity: '0.8'};
var currentMarker;

//var markerArray = new Array();
var markerData = new Object();

map.fitBounds(bounds);
map.setMaxBounds(bounds);
$('.leaflet-container').css('cursor','crosshair');

window.onload = function() {
	//localStorage.setItem('markerData', "");
	if(localStorage.getItem('markerData')) {
		markerData = JSON.parse(localStorage.getItem('markerData'));
	}
	loadMarkers(markerData);
};

// handle map clicking
map.on('click', onMapClick);

function onMapClick(e) {
	var newMarker = new L.marker(e.latlng).addTo(map);
	//markerArray.push(newMarker);
	//markerData[newMarker._leaflet_id] = newMarker;
	var markerId = newMarker._leaflet_id;

	// marker popup content
	popupContent = "" +
	"<div class='marker-box'>" +
		"<div class='marker-edit " + markerId + "'>" +
			"<p>Time <input type='text' name='markerHours" + markerId + "' class='markerTextBox' id='markerHours' maxlength='2' />:<input type='text' name='markerMins" + markerId + "' class='markerTextBox' id='markerMins' maxlength='2' /></p>" +
			"<a href='#' class='saveMarkerButton'>Save</a><br /><a href='#' class='deleteMarkerButton'>Delete Marker</a>" +
	"</div>";

	var popupOptions = {
		//'minWidth': '100',
	};

	newMarker.on('popupopen', onPopupOpen);

	newMarker.bindPopup(popupContent, popupOptions).openPopup();

	newMarker.bindTooltip('00:00', toolTipSettings);



	//console.log(e);
}

// handle events when popup is opened
function onPopupOpen() {
	var e = this;

	$('.deleteMarkerButton:visible').click(function() {
		map.removeLayer(this);
	});

	$('.saveMarkerButton:visible').click(function() {
		onSave(e);
	});
}

function onSave(e) {
	var markerHoursId = $('#markerHours').attr('name');
	var markerMinsId = $('#markerMins').attr('name');

	var markerHours = $('input[name="markerHours' + e._leaflet_id + '"]').val();
	var markerMins = $('input[name="markerMins' + e._leaflet_id + '"]').val();
	var startDate = Date.now();

	var newData = [e._leaflet_id, e._latlng, markerHours, markerMins, startDate];
	
	markerData[e._leaflet_id] = newData;
	localStorage.setItem('markerData', JSON.stringify(markerData));

	e.setTooltipContent(markerHours + ':' + markerMins);
	e.closePopup();
}

function onCreate(e) {
	var markerLoc = [e._leaflet_id, e._latlng]
	localStorage.setItem('markerLoc', JSON.stringify(markerLoc));
}

function loadMarkers(markerObject) {
	for(var key in markerObject) {
		var markerArray = markerObject[key];
		var markerId = markerArray[0];
		var latlng = new Object();
		latlng = markerArray[1];
		loadedMarker = new L.marker(latlng).addTo(map);
		loadedMarker.bindTooltip('00:00', toolTipSettings);
		loadedMarker.bindPopup(popupContent, popupOptions);
		console.log(markerArray);
	}
}

function updateTime() {}