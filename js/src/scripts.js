//
// LEAFLET JS
//

var map = L.map('mapid', {
	crs: L.CRS.Simple,
	minZoom: 0,
	maxZoom: 2,
	zoomSnap: 0.5,
	zoomDelta: 0.5,
	maxBoundsViscosity: 0.8,
});

var bounds = [[0,0], [1744,1738]];
var image = L.imageOverlay('images/map.jpg', bounds).addTo(map);
var markerData;
var popupOptions;
var toolTipSettings = {permanent: true, direction: 'top', opacity: '0.9'};

var markerData = new Object();

map.fitBounds(bounds);
map.setMaxBounds(bounds);
$('.leaflet-container').css('cursor','crosshair');

window.onload = function() {
	//localStorage.setItem('markerData', '');

	markerData = getMarkers();
	markerData = loadMarkers(markerData);

	// save markers with new ids
	storeMarkers(markerData);
};

// handle menu clicking
$('.deleteAllMarkers:visible').click(function() {
	if(confirm('Are you sure you want to REMOVE all markers?')) {
		deleteAllMarkers();
		location.reload();
	}
});
$('.resetMarkers:visible').click(function() {
	if(confirm('Are you sure you want add markers for loot crates, blockades, and uplinks?')) {
		addPresetMarkers();
		location.reload();
	}
});

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

	// autofill saved data
	if(markerData[e._leaflet_id]) {
		if(markerData[e._leaflet_id][2] !== "") {
			$('input[name="markerHours' + e._leaflet_id + '"]').val(markerData[e._leaflet_id][2]);
		}
		
		$('input[name="markerMins' + e._leaflet_id + '"]').val(markerData[e._leaflet_id][3]);
		$('input[name="markerType' + e._leaflet_id + '"][value="' + markerData[e._leaflet_id][5] + '"').prop('checked', true);
	}

	$('.deleteMarkerButton:visible').click(function() {
		map.removeLayer(e);
		onDelete(e);
	});

	$('.saveMarkerButton:visible').click(function() {
		$('.watermark').watermark('clearWatermarks');
		onSave(e);
	});

	$('.resetMarkerButton:visible').click(function() {
		onReset(e);
	})

	$('.watermark').watermark(); // add text watermarks
}

function onSave(e) {
	var markerHoursId = $('#markerHours').attr('name');
	var markerMinsId = $('#markerMins').attr('name');
	var markerHours = $('input[name="markerHours' + e._leaflet_id + '"]').val();
	var markerMins = $('input[name="markerMins' + e._leaflet_id + '"]').val();
	var startDate = Date.now();
	var markerType = $('input[name="markerType' + e._leaflet_id + '"]:checked').val();
	console.log(markerType);

	// dont forget to change newMarkerObject
	var newData = [e._leaflet_id, e._latlng, markerHours, markerMins, startDate, markerType];
	
	markerData[e._leaflet_id] = newData;

	storeMarkers(markerData);

	e.setTooltipContent('0:00:00');
	updateTime(e._leaflet_id, markerHours, markerMins, startDate);

	e.closePopup();
}

function onDelete(e) {
	delete markerData[e._leaflet_id];
	storeMarkers(markerData);
}

function onReset(e) {
	if(markerData[e._leaflet_id]) {
		var markerHours = markerData[e._leaflet_id][2];
		var markerMins = markerData[e._leaflet_id][3];
		var startDate = Date.now();

		var selectedMarkerType = markerData[e._leaflet_id][5];

		if(selectedMarkerType == 'lootCrate') {
			markerHours = '2';
			markerMins = '00';
		}
		if(selectedMarkerType == 'uplinkBlockade') {
			markerHours = '0';
			markerMins = '45';
		}

		updateTime(e._leaflet_id, markerHours, markerMins, startDate);

		markerData[e._leaflet_id][2] = markerHours;
		markerData[e._leaflet_id][3] = markerMins;
		markerData[e._leaflet_id][4] = startDate;

		storeMarkers(markerData);
		e.closePopup();
	}
}

function loadMarkers(markerObject) {
	var newMarkerObject = Object();
	for(var key in markerObject) {
		var markerArray = markerObject[key];
		var markerId = markerArray[0];
		var markerHours = markerArray[2];
		var markerMins = markerArray[3];
		var startDate = markerArray[4];
		var markerType = markerArray[5];
		var latlng = markerArray[1];

		loadedMarker = new L.marker(latlng).addTo(map);
		toolTipSettings.className = loadedMarker._leaflet_id;
		loadedMarker.bindTooltip('0:00:00', toolTipSettings);

		$('input[name="markerType' + loadedMarker._leaflet_id + '"][value="' + markerType + '"').prop('checked', true);

		var popupContent = getPopupContent(loadedMarker._leaflet_id);
		loadedMarker.on('popupopen', onPopupOpen);
		loadedMarker.bindPopup(popupContent, popupOptions);

		updateTime(loadedMarker._leaflet_id, markerHours, markerMins, startDate);

		// we have to save newly generated ids since we cant retain the old ids after loading the markers
		newMarkerObject[loadedMarker._leaflet_id] = [loadedMarker._leaflet_id, loadedMarker._latlng, markerHours, markerMins, startDate, markerType];
	}

	return newMarkerObject;
}

function storeMarkers(a) {
	localStorage.setItem('markerData', JSON.stringify(a));
}

function getMarkers() {
	var a;

	if(localStorage.getItem('markerData')) {
		a = JSON.parse(localStorage.getItem('markerData'));
	}

	return a;
}

function updateTime(markerId, markerHours, markerMins, startDate) {
	addToDate = ((markerHours * 60 * 60) + (markerMins * 60)) * 1000;

	$('.leaflet-tooltip.' + markerId).countdown(startDate + addToDate, function(event) {
		$(this).html(event.strftime('%-H:%M:%S'));
	})
	.on('update.countdown', function(event) {
		if(event.offset.hours < 1) {
			if(event.offset.minutes < 10 && event.offset.minutes >= 3) {
				$(this).addClass('stage-two-timer');
				$(this).removeClass('stage-three-timer');
			}
			if(event.offset.minutes < 3) {
				$(this).addClass('stage-three-timer');
				$(this).removeClass('stage-two-timer');
			}
		}
		else {
			$(this).removeClass('stage-two-timer');
			$(this).removeClass('stage-three-timer');
		}
	});
}

function getPopupContent(markerId) {
	popupContent = "" +
	"<div class='marker-box'>" +
		"<div class='marker-edit " + markerId + "'>" +
			"<p>Time <input type='text' name='markerHours" + markerId + "' class='markerTextBox watermark' id='markerHours' maxlength='1' title='h' /> : <input type='text' name='markerMins" + markerId + "' class='markerTextBox watermark' id='markerMins' maxlength='2' title='mm' /></p>" +
			"<p><label for='lootCrate'><input type='radio' name='markerType" + markerId + "' id='lootCrate' value='lootCrate' /> Loot Crate</label><br /><label for='uplinkBlockade'><input type='radio' name='markerType" + markerId + "' id='uplinkBlockade' value='uplinkBlockade' /> Uplink/Blockade<br /><label for='custom'><input type='radio' name='markerType" + markerId + "' id='custom' value='custom' checked='checked' /> Custom</label></p>" +
			"<a href='#' class='saveMarkerButton'>Save</a> | <a href='#' class='deleteMarkerButton'>Delete</a> | <a href='#' class='resetMarkerButton'>Restart</a>" +
	"</div>";

	return popupContent;
}

function deleteAllMarkers() {
	localStorage.setItem('markerData', '');
	return true;
}

function deletePresetMarkers() {
	for(var key in markerData) {
		var newData = markerData[key];
		//console.log(newData);
		if((newData[5] == "lootCrate") || (newData[5] == "uplinkBlockade")) {
			delete markerData[key];
		}
	}

	storeMarkers(markerData);
}

function addPresetMarkers() {
	var startDate = Date.now();

	// loot crates
	var lootCratesObject = new Object();
	lootCratesObject.silentValley = [368,1386];
	lootCratesObject.summitAirfield = [1576,537];
	lootCratesObject.summitAirfield2 = [1531,530];
	lootCratesObject.summitAirfield3 = [1525,573];
	lootCratesObject.sneakyDevilsberg = [1501,1000];
	lootCratesObject.sneakyDevilsberg2 = [1480,930];
	lootCratesObject.hellsPeak = [1321,681];
	lootCratesObject.northernExcavation = [1251,1300];
	lootCratesObject.hotelBravo = [965,1402];
	lootCratesObject.wolfpineTunnel = [860,389];
	lootCratesObject.wolfpine = [810,483];
	lootCratesObject.mistyvale = [925,858];
	lootCratesObject.mistyvale2 = [846,828];
	lootCratesObject.mistyvale3 = [835,828];
	lootCratesObject.mistyvale4 = [824,840];
	lootCratesObject.mistyvale5 = [826,923];
	lootCratesObject.patsRepairShop = [792,1058];
	lootCratesObject.melsGrainFarm = [640,988];
	lootCratesObject.southernExcavation = [449,679];
	lootCratesObject.jaysResort = [484,943];
	lootCratesObject.jaysResort2 = [474,924];
	lootCratesObject.adamsScrapyard = [571,1110];
	lootCratesObject.adamsScrapyard2 = [534,1100];
	lootCratesObject.fortQCLewis = [593,1357];
	lootCratesObject.fortQCLewis2 = [571,1359];

	// blockades
	var blockadesObject = new Object();
	blockadesObject.westBlockade = [1179,622];
	blockadesObject.eastBlockade = [756,1394];

	// uplinks
	var uplinksObject = new Object();
	uplinksObject.westUplink = [1053,298];
	uplinksObject.westUplink2 = [772,666];
	uplinksObject.eastUplink = [973,1487];

	deletePresetMarkers();

	var genId = 0;
	for(var key in lootCratesObject) {
		var newLatLng = lootCratesObject[key];
		var newData = ['lootCrate' + genId, newLatLng, 2, '00', 0, 'lootCrate'];
		markerData['lootCrate' + genId] = newData;
		genId += 1;
	}

	var genId = 0;
	for(var key in blockadesObject) {
		var newLatLng = blockadesObject[key];
		var newData = ['blockade' + genId, newLatLng, 0, 45, 0, 'uplinkBlockade'];
		markerData['blockade' + genId] = newData;
		genId += 1;
	}

	var genId = 0;
	for(var key in uplinksObject) {
		var newLatLng = uplinksObject[key];
		var newData = ['uplink' + genId, newLatLng, 0, 45, 0, 'uplinkBlockade'];
		markerData['uplink' + genId] = newData;
		genId += 1;
	}

	storeMarkers(markerData);

	return true;
}