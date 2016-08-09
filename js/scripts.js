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

//var markerArray = new Array();
var markerData = new Object();

map.fitBounds(bounds);
map.setMaxBounds(bounds);
$('.leaflet-container').css('cursor','crosshair');

window.onload = function() {
	if(localStorage.getItem('markers')) {
		markerData = JSON.parse(localStorage.getItem('markers'))
	}
	loadMarkers(markerData);
	//console.log(markerData);
	//localStorage.setItem('markers', "");
};

// handle map clicking
map.on('click', onMapClick);

function onMapClick(e) {
	var newMarker = new L.marker(e.latlng).addTo(map);
	newMarker.bindTooltip('00:00', {permanent: true, direction: 'top', opacity: '0'});
	//markerArray.push(newMarker);
	markerData[newMarker._leaflet_id] = newMarker;

	// marker popup content
	var popupContent = "" +
	"<div class='marker-box'>" +
		"<div class='marker-edit " + newMarker._leaflet_id + "'>" +
			//"<h4><input type='text' name='markerTitle" + newMarker._leaflet_id + "' class='markerTextBox' id='markerTitle' /></h4>" +
			"<p>Time <input type='text' name='markerHours" + newMarker._leaflet_id + "' class='markerTextBox' id='markerHours' maxlength='2' />:<input type='text' name='markerMins" + newMarker._leaflet_id + "' class='markerTextBox' id='markerMins' maxlength='2' /></p>" +
			"<a href='#' class='saveMarkerButton'>Save</a><br /><a href='#' class='deleteMarkerButton'>Delete Marker</a>" +
	"</div>";

	var popupOptions = {
		//'minWidth': '100',
	};

	newMarker.on('popupopen', onPopupOpen);

	newMarker.bindPopup(popupContent, popupOptions).openPopup();

	console.log(newMarker);
}

// handle events when popup is opened
function onPopupOpen() {
	var e = this;

	$('.deleteMarkerButton:visible').click(function() {
		map.removeLayer(e);
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

	// console.log(markerTitleId + " " + markerHoursId + " " + markerMinsId);
	// console.log(markerTitle + " " + markerHours + " " + markerMins);
	console.log(newData);
	
	markerData[e._leaflet_id] = newData;
	localStorage.setItem('markers', JSON.stringify(markerData));
	//console.log(markerData);
	console.log(JSON.parse(localStorage.getItem('markers')));

	e.setTooltipContent(markerHours + ':' + markerMins);
	e.closePopup();
}

function loadMarkers(markerObject) {
	for(var key in markerObject) {
		var markerArray = markerObject[key];
		L.marker(markerArray[1]).addTo(map);
		console.log(markerArray);
	}
}

function updateTime() {}