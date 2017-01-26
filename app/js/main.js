let mymap = L.map('mapid').setView([39.9525840, -75.1652220], 9);

let geojsonFeaturesCollection;
let geoLayer;

const homeButton = document.querySelector('#home');
const removeButton = document.querySelector('#remove');
const allButton = document.querySelector('#all');
const toVisitButton = document.querySelector('#visit');
const visitedButton = document.querySelector('#visited');
const visitingButton = document.querySelector('#visiting');
const filterForm = document.querySelector('.brewery-search');
const filterButton = document.querySelector('#filter');

const nearMeButton = document.querySelector('#nearme');


L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV2bm9pc2UiLCJhIjoiY2l4aThwOGVxMDAwODJ3cGo3dmt0MGcxeCJ9.UOpyx8-_bHDoyLPHfQ_Q4Q', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 16,
  id: 'your.mapbox.project.id',
  accessToken: 'your.mapbox.public.access.token'
}).addTo(mymap);

function resetMap() {
  mymap.setView([39.9525840, -75.1652220], 9);
}

function addFeaturesToLayer(featuresCollection) {
  newLayer = L.geoJSON(featuresCollection, {
    pointToLayer: function(feature, latlng) {
      var newMarker = L.VectorMarkers.icon({
        icon: remapIcon(feature.properties['marker-symbol']),
        markerColor: remapColor(feature.properties['marker-color'])
      });
      return new L.marker(latlng, {
        icon: newMarker
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<strong><a href="${feature.properties.url}" target="_blank">${feature.properties.name}</a></strong><br/>${feature.properties.address}`);
    }
  });

  var markers = L.markerClusterGroup();
  markers.addLayer(newLayer);

  return markers;
}

function remapColor(color) {
  switch (color) {
    case '#0047AB':
      return '#0047AB';
    case '#009688':
      return '#00A882';
    case '#607D8B':
      return '#FFCA00';
    case '#FF8C00':
      return '#FF9F00';
    default:
      return color;
  }
}

function remapIcon(icon) {
  switch (icon) {
    case 'restaurant':
      return 'cutlery';
    case 'cross':
      return 'times';
    default:
      return icon;
  }
}

function removeBreweries() {
  mymap.removeLayer(geoLayer);
}

function addBreweries(filter = false) {
  removeBreweries();
  filterForm.reset();

  if (filter) {
    // Want to retain brewery data so making a quick clone for filtering
    let newGeoJSON = JSON.parse(JSON.stringify(geojsonFeaturesCollection));
    newGeoJSON.features = newGeoJSON.features.filter(feature => (feature.properties['marker-size'] === filter));
    geoLayer = addFeaturesToLayer(newGeoJSON);
  } else {
    geoLayer = addFeaturesToLayer(geojsonFeaturesCollection);
  }
  mymap.addLayer(geoLayer);
}

function filterBreweries(e) {
  if (e) {
    e.preventDefault();
  }
  removeBreweries();

  const search = filterForm.querySelector('[name=brewery]').value.toLowerCase();
  console.log(search);

  let newGeoJSON = JSON.parse(JSON.stringify(geojsonFeaturesCollection));
  newGeoJSON.features = newGeoJSON.features.filter(feature => (feature.properties.name.toLowerCase().includes(search)));
  geoLayer = addFeaturesToLayer(newGeoJSON);

  mymap.addLayer(geoLayer);
}


homeButton.addEventListener('click', resetMap);
removeButton.addEventListener('click', removeBreweries);
allButton.addEventListener('click', addBreweries.bind(null, false));
toVisitButton.addEventListener('click', addBreweries.bind(null, 'small'));
visitedButton.addEventListener('click', addBreweries.bind(null, 'large'));
visitingButton.addEventListener('click', addBreweries.bind(null, 'medium'));
filterForm.addEventListener('submit', filterBreweries);
filterButton.addEventListener('click', filterBreweries);

nearMeButton.addEventListener('click', showNearMe);

console.log(allButton);

function makeRequest(url) {
  httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }
  httpRequest.onreadystatechange = requestChange;
  httpRequest.open('GET', url);
  httpRequest.send();
}

function requestChange() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      addPointsToMap(httpRequest.responseText);
    } else {
      alert('There was a problem with the request.');
    }
  }
}

function addPointsToMap(points) {
  geojsonFeaturesCollection = JSON.parse(points);

  geoLayer = addFeaturesToLayer(geojsonFeaturesCollection);
  geoLayer.addTo(mymap);
}

var url = './myBreweryList.geojson';
if (self.fetch) {
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(data) {
      addPointsToMap(data);
    });
} else {
  makeRequest(url);
}

const radii = [
  8047,
  16094,
  40234
];
let currentRadiusIndex = 0;
let filterCircle;
let userPosition;


function showNearMe() {
  if (!userPosition) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    currentRadiusIndex++;

    if (radii.length === currentRadiusIndex) {
      mymap.removeLayer(filterCircle);
      currentRadiusIndex = -1;
    } else {
      placeMyPosition();
    }
  }
}

function showPosition(position) {
  userPosition = {};
  userPosition.lat = position.coords.latitude;
  userPosition.long = position.coords.longitude;
  placeMyPosition();
}

function placeMyPosition() {
  if (filterCircle) {
    mymap.removeLayer(filterCircle);
  }

  filterCircle = L.circle(L.latLng(userPosition.lat, userPosition.long), radii[currentRadiusIndex], {
    opacity: 1,
    weight: 1,
    fillOpacity: 0.25,
    color: '#0047AB'
  }).addTo(mymap);
  mymap.panTo(L.latLng(userPosition.lat, userPosition.long));
}
