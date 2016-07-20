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

map.fitBounds(bounds);
map.setMaxBounds(bounds);
$('.leaflet-container').css('cursor','crosshair');

map.on('click', onMapClick);

function onMapClick(e) {
	var newMarker = new L.marker(e.latlng).addTo(map);
	markerArray.push(newMarker);

	// marker popup content
	var popupContent = "<div class='marker-box'>" +
	"<h4>Title</h4>" +
	"<p>Description</p>" +
	"<p>Time</p>" +
	"<a href='#' class='deleteMarkerButton'>Delete Marker</a>" +
	"</div>";

	var popupOptions = {
		'minWidth': '100',
	};
	
	newMarker.on('popupopen', onPopupOpen);

	newMarker.bindPopup(popupContent, popupOptions).openPopup();	
}

// handle events when popup is opened
function onPopupOpen() {
	var tempMarker = this;

	$('.deleteMarkerButton:visible').click(function() {
		map.removeLayer(tempMarker);
	});
}