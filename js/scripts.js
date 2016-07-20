var map = L.map('mapid', {
	crs: L.CRS.Simple,
	minZoom: 0,
	maxZoom: 1,
});

var bounds = [[0,0], [1938,1762]];
var image = L.imageOverlay('images/map_v1.jpg', bounds).addTo(map);

var defaultIcon = L.icon({
	iconUrl: 'images/marker-icon.png',
	shadowUrl: 'images/marker-shadow.png',

	iconSize: [25,41],
	shadowSize: [41,41],
	iconAnchor: [13,41],
})

var markerArray = new Array();

map.fitBounds(bounds);
map.setMaxBounds(bounds);

map.on('click', function(e) {
	function addMarker(e) {
		var newMarker = new L.marker(e.latlng, {icon: defaultIcon}).addTo(map);
		markerArray.push(newMarker);
	}

	addMarker(e);

	alert(markerArray);

});