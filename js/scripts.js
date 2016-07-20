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

map.on('click', function(e) {
	function addMarker(e) {
		var newMarker = new L.marker(e.latlng).addTo(map);
		markerArray.push(newMarker);
		newMarker.bindPopup('test').openPopup();
	}

	addMarker(e);
});