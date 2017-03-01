let fs = require('fs');

const visitFile = process.argv[2];
const dirName = process.argv[3];
const outputFile = process.argv[4];
const onlyMybreweries = process.argv[5] ? true : false;

let myBreweries = {};
let visitData;

if (dirName && visitFile && outputFile) {
  visitData = readJSONFile(visitFile);
  mergeAll(dirName);
} else {
  const node = getFileName(process.argv[0]);

  const script = getFileName(process.argv[1]);

  console.log("Usage: " + node + " " + script + " <dirname>");
}

function getFileName(path) {
  return path.substring(path.lastIndexOf('/') + 1, path.length);
}

function isGeoJsonFile(file) {
  return file.endsWith('.geojson');
}

function caseInsensitiveSort(a, b) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}

function readBrewery(fileName) {
  const text = fs.readFileSync(fileName, "utf8");
  const brewery = JSON.parse(text);

  return brewery;
}

function readJSONFile(fileName) {
  var data;
  try {
    var text = fs.readFileSync(fileName, "utf8");

    var re1 = /([\}\]])\s+([\{\[])/gm;
    text = text.replace(re1, "$1,$2");

    var re2 = /([\}\]\"]),(\s+)?([\}\]])/gm;
    text = text.replace(re2, "$1 $3");

    data = JSON.parse(text);
  } catch (e) {
    console.log("ERROR: file: " + fileName + " error: " + e.message);

    return false;
  }

  return data;
}

function writeBreweryMerge(fileName, breweries) {
  let out = fs.createWriteStream(fileName, {
    encoding: "utf8"
  });
  out.write(JSON.stringify(breweries, null, 2));
  out.write("\n");
  out.end(); // currently the same as destroy() and destroySoon()
}

function mergeAll(dirName) {
  let breweries = [];

  fs.readdir(dirName, processBreweries);

  function processBreweries(err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files = files.filter(isGeoJsonFile);
    files.sort(caseInsensitiveSort);
    files.forEach(addBrewery);

    function addBrewery(fileName) {
      const brewery = readBrewery(dirName + "/" + fileName);
      let includeBrewery = !onlyMybreweries;

      if (visitData) {
        brewery.features.forEach(function(item) {
          if (visitData[item.properties.geoBeerId]) {
            includeBrewery = true;
            //console.log(item.properties.geoBeerId,item.properties.name,visitData[item.properties.geoBeerId]);
            switch (visitData[item.properties.geoBeerId]) {
              case 'tour':
                item.properties['marker-color'] = '#009688';
                item.properties['marker-size'] = 'medium';
                break;
              default:
                item.properties['marker-color'] = '#0047AB';
                item.properties['marker-size'] = 'large';
                break;
            }
          }
          if (includeBrewery) {
            breweries.push(item);
          }
        });
      } else {
        console.log("Visit data not initialized");
      }
    }

    const allBreweries = {
      "type": "FeatureCollection",
      "features": breweries
    };

    writeBreweryMerge(outputFile, allBreweries);
  }
}
