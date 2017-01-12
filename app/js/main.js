let mymap = L.map('mapid').setView([39.9525840, -75.1652220], 8);
let geojsonFeaturesCollection;
let geoLayer;

const removeButton = document.querySelector('#remove');
const allButton = document.querySelector('#all');
const visitedButton = document.querySelector('#visited');
const visitingButton = document.querySelector('#visiting');
const filterForm = document.querySelector('.brewery-search');

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGV2bm9pc2UiLCJhIjoiY2l4aThwOGVxMDAwODJ3cGo3dmt0MGcxeCJ9.UOpyx8-_bHDoyLPHfQ_Q4Q', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'your.mapbox.project.id',
  accessToken: 'your.mapbox.public.access.token'
}).addTo(mymap);

var url = 'https://raw.githubusercontent.com/devNoiseConsulting/geoBeer/master/myBreweryList.geojson';
fetch(url)
  .then(function(response) {
    return response.text();
  })
  .then(function(data) {
    geojsonFeaturesCollection = JSON.parse(data);

    geoLayer = addFeaturesToLayer(geojsonFeaturesCollection);
    geoLayer.addTo(mymap);
    console.log(geojsonFeaturesCollection);
  });

function addFeaturesToLayer(featuresCollection) {
  newLayer = L.geoJSON(featuresCollection, {
    pointToLayer: function(feature, latlng) {
      let breweryIcon = 'beer';
      if (feature.properties['marker-symbol'] == 'restaurant') {
        breweryIcon = 'cutlery';
      }
      var newMarker = L.VectorMarkers.icon({
        icon: breweryIcon,
        markerColor: feature.properties['marker-color']
      });
      return new L.marker(latlng, {
        icon: newMarker
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<strong><a href="${feature.properties.url}" target="_blank">${feature.properties.name}</a></strong><br/>${feature.properties.address}`);
    }
  });

  return newLayer;
}

function removeBreweries() {
  mymap.removeLayer(geoLayer);
}

function addBreweries(filter = false) {
  removeBreweries();
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
  e.preventDefault();
  removeBreweries();

  const search = this.querySelector('[name=brewery]').value.toLowerCase();
  console.log(search);

  let newGeoJSON = JSON.parse(JSON.stringify(geojsonFeaturesCollection));
  newGeoJSON.features = newGeoJSON.features.filter(feature => (feature.properties.name.toLowerCase().includes(search)));
  geoLayer = addFeaturesToLayer(newGeoJSON);

  mymap.addLayer(geoLayer);
}

removeButton.addEventListener('click', removeBreweries);
allButton.addEventListener('click', addBreweries.bind(null, false));
visitedButton.addEventListener('click', addBreweries.bind(null, 'large'));
visitingButton.addEventListener('click', addBreweries.bind(null, 'medium'));
filterForm.addEventListener('submit', filterBreweries);
