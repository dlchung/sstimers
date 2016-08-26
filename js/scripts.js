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
var popupOptions;
var toolTipSettings = {permanent: true, direction: 'top', opacity: '0.8'};

var markerData = new Object();

map.fitBounds(bounds);
map.setMaxBounds(bounds);
$('.leaflet-container').css('cursor','crosshair');

window.onload = function() {
	//localStorage.setItem('markerData', "");

	markerData = getMarkers();
	markerData = loadMarkers(markerData);

	// save markers with new ids
	storeMarkers(markerData);
};

// handle map clicking
map.on('click', onMapClick);

function onMapClick(e) {
	var newMarker = new L.marker(e.latlng).addTo(map);
	var markerId = newMarker._leaflet_id;
	var popupContent = getPopupContent(markerId);

	var popupOptions = {
		//'minWidth': '100',
	};

	newMarker.on('popupopen', onPopupOpen);
	newMarker.bindPopup(popupContent, popupOptions).openPopup();
	toolTipSettings.className = markerId;
	newMarker.bindTooltip('0:00:00', toolTipSettings);
}

// handle events when popup is opened
function onPopupOpen() {
	var e = this;

	$('.deleteMarkerButton:visible').click(function() {
		map.removeLayer(e);
		onDelete(e);
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

	// dont forget to change newMarkerObject
	var newData = [e._leaflet_id, e._latlng, markerHours, markerMins, startDate];
	
	markerData[e._leaflet_id] = newData;

	storeMarkers(markerData);

	e.setTooltipContent('00:00:00');
	updateTime(e._leaflet_id, markerHours, markerMins, startDate);
	e.closePopup();
}

function onDelete(e) {
	// var markerId = $('.marker-edit.' + this._leaflet_id);
	// console.log(markerId);
	delete markerData[e._leaflet_id];
	storeMarkers(markerData);
}

function loadMarkers(markerObject) {
	var newMarkerObject = Object();
	//console.log(markerObject);
	for(var key in markerObject) {
		var markerArray = markerObject[key];
		var markerId = markerArray[0];
		var markerHours = markerArray[2];
		var markerMins = markerArray[3];
		var startDate = markerArray[4];
		var latlng = new Object();
		var popupContent = getPopupContent(markerId);

		latlng = markerArray[1];
		loadedMarker = new L.marker(latlng).addTo(map);
		toolTipSettings.className = loadedMarker._leaflet_id;
		loadedMarker.bindTooltip('00:00:00', toolTipSettings);
		loadedMarker.on('popupopen', onPopupOpen);
		loadedMarker.bindPopup(popupContent, popupOptions);

		updateTime(loadedMarker._leaflet_id, markerHours, markerMins, startDate);

		// we have to save newly generated ids since we cant retain the old ids after loading the markers
		newMarkerObject[loadedMarker._leaflet_id] = [loadedMarker._leaflet_id, loadedMarker._latlng, markerHours, markerMins, startDate];
	}

	return newMarkerObject;
}

function storeMarkers(a) {
	localStorage.setItem('markerData', JSON.stringify(a));
}

function getMarkers() {
	if(localStorage.getItem('markerData')) {
		a = JSON.parse(localStorage.getItem('markerData'));
	}

	return a;
}

function updateTime(markerId, markerHours, markerMins, startDate) {
	addToDate = ((markerHours * 60 * 60) + (markerMins * 60)) * 1000;

	$('.leaflet-tooltip.' + markerId).countdown(startDate + addToDate, function(event) {
		$(this).html(event.strftime('%H:%M:%S'));
	});
}

function getPopupContent(markerId) {
	popupContent = "" +
	"<div class='marker-box'>" +
		"<div class='marker-edit " + markerId + "'>" +
			"<p>Time <input type='text' name='markerHours" + markerId + "' class='markerTextBox' id='markerHours' maxlength='2' />:<input type='text' name='markerMins" + markerId + "' class='markerTextBox' id='markerMins' maxlength='2' /></p>" +
			"<p><input type='radio' />Loot Crate<br /><input type='radio' />Uplink/Blockade</p>" +
			"<a href='#' class='saveMarkerButton'>Save</a> | <a href='#' class='deleteMarkerButton'>Delete</a> | <a href='#' class='resetMarkerButton'>Reset</a>" +
	"</div>";

	return popupContent;
}