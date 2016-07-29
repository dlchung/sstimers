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

var markerArray = new Array();
var markerData = new Array();

map.fitBounds(bounds);
map.setMaxBounds(bounds);
$('.leaflet-container').css('cursor','crosshair');

map.on('click', onMapClick);

function onMapClick(e) {
	var newMarker = new L.marker(e.latlng).addTo(map);
	markerArray.push(newMarker);

	// marker popup content
	var popupContent = "" +
	"<div class='marker-box'>" +
		"<div class='marker-edit " + newMarker._leaflet_id + "'>" +
			"<h4><input type='text' name='markerTitle" + newMarker._leaflet_id + "' class='markerTextBox' id='markerTitle' /></h4>" +
			"<p>Time <input type='text' name='markerHours" + newMarker._leaflet_id + "' class='markerTextBox' id='markerHours' />:<input type='text' name='markerMins" + newMarker._leaflet_id + "' class='markerTextBox' id='markerMins' /></p>" +
			"<a href='#' class='saveMarkerButton'>Save</a> <a href='#' class='deleteMarkerButton'>Delete Marker</a>" +
		"</div>" +
		"<div class='marker-timer " + newMarker._leaflet_id + "' style='display: none'>" +
			"<div class='timer-box'>" +
				"<p>timer</p>" +
			"</div>" +
		"</div>" +
	"</div>";

	var popupOptions = {
		'minWidth': '100',
	};

	newMarker.on('popupopen', onPopupOpen);

	newMarker.bindPopup(popupContent, popupOptions).openPopup();

	$('.marker-timer.' + newMarker._leaflet_id).hide();

	//console.log(newMarker);
	//alert(newMarker._leaflet_id);
}

// handle events when popup is opened
function onPopupOpen() {
	var e = this;

	$('.deleteMarkerButton:visible').click(function() {
		map.removeLayer(e);
	});

	$('.saveMarkerButton:visible').click(function() {
		onSave(e);
		$('.marker-edit.' + e._leaflet_id).hide();
		$('.marker-timer.' + e._leaflet_id).show();
	});
}

function onSave(e) {
	var markerTitleId = $('#markerTitle').attr('name');
	var markerHoursId = $('#markerHours').attr('name');
	var markerMinsId = $('#markerMins').attr('name');

	var markerTitle = $('input[name="markerTitle' + e._leaflet_id + '"]').val();
	var markerHours = $('input[name="markerHours' + e._leaflet_id + '"]').val();
	var markerMins = $('input[name="markerMins' + e._leaflet_id + '"]').val();

	var newData = [e._leaflet_id, markerTitle, markerHours, markerMins];

	// console.log(markerTitleId + " " + markerHoursId + " " + markerMinsId);
	// console.log(markerTitle + " " + markerHours + " " + markerMins);
	console.log(newData);

	markerData.push(newData);
	console.log(markerData);

	//e.closePopup();
}

function onEdit() {}