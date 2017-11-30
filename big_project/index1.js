document.addEventListener('DOMContentLoaded', function() {
  stop_data_url = 'https://data.cityofchicago.org/api/views/8pix-ypme/rows.xml?accessType=DOWNLOAD'
}, false); // dom load

function initLineSelector(target = 'line-select') {
  var lines = {
    "Select a Line":"-",
    "Red Line":"RED",
    "Blue Line":"BLUE",
    "Green Line":"G",
    "Brown Line":"BRN",
    "Purple Line":"P",
    "Yellow Line":"Y",
    "Pink Line":"Pnk",
    "Orange Line":"O"
  };
  for(var line in lines) {
    $('<option value="'+ lines[line] + '">'+ line + '</option>').appendTo('#' + target);
  }
}

/* Loads all stops and stores their information in a data structure */
function loadStops() {
  var stops = [];
  $.get(stop_data_url, {
    // wait for the callback
  }).done( function (xml) {
    $(xml).find('row').each(function(index, value) {

      // skip the first row
      if(index == 0) return;

      var stop = {};
      stop.stop_id = $(this).find('stop_id').text();
      stop.stop_name = $(this).find('stop_name').text();
      stop.station_name = $(this).find('station_name').text();
      stop.station_desc_name = $(this).find('station_descriptive_name').text();
      stop.map_id = $(this).find('map_id').text();
      stop.ada = $(this).find('ada').text();
      stop.red = $(this).find('red').text();
      stop.blue = $(this).find('blue').text();
      stop.g = $(this).find('g').text();
      stop.brn = $(this).find('brn').text();
      stop.p = $(this).find('p').text();
      stop.y = $(this).find('y').text();
      stop.pnk = $(this).find('pnk').text();
      stop.o = $(this).find('o').text();
      stops.push(stop);
    });
  });
  return stops;
}


function getStopsByLine(ctaId, stops) {
  lineStops = [];
  for (var i = 0; i < stops.length; i ++) {
    if(stops[i][ctaId.toLowerCase()] =='true') lineStops.push(stops[i]);
  }
  return lineStops;
}



