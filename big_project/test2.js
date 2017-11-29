document.addEventListener('DOMContentLoaded', function() {
  var api_key = '0d49b01cdbb6409d944b1d5ad2c5e450';
  var arrivals_base_url = 'https://lapi.transitchicago.com/api/1.0/ttarrivals.aspx/';

  initLineSelector();
  var stops = loadStops();

  $('#line-select').on('change', function() {
    var lineStops = getStopsByLine($(this).val(), stops);
    lineStops.sort(function(a,b) { return a.stop_name.localeCompare(b.stop_name)});
    renderStopSelect(lineStops);
  });

  function renderStopSelect(lineStops) {
    $('#stop-select').find('option').remove().end();
    parentIds = [];
    lineStops.forEach(function(stop) {
      if(!parentIds.includes(stop.map_id)) {
        parentIds.push(stop.map_id);
        $('<option value="'+ stop.map_id + '">'+ stop.station_name + '</option>').appendTo('#stop-select');
      }
    });
  }
  
  $('#btnsearch').on("click",function() {
    var request_url = arrivals_base_url + '?key=' + api_key;
    request_url += '&mapid=' + $('#stop-select').val(); 
    
    var resultHeader = 'Arrivals at ' + $('#stop-select option:selected').text();
    $.get('request_url', function (xml) {
      var resultsHtml = '<h4>' + resultHeader + '</h4><hr>';
      resultsHtml += renderArrivalResults(xml);
      $('#results').html(resultsHtml + '<br>');
    });
  });
  

  $(document).on('click',function () {
    this.id})}, false); // dom load


function renderArrivalResults(xml) {
  resultsHtml = '';
  $(xml).find('eta').each(function() {
    var train = $(this);
    var trainHtml = '';
    var run = train.find('rn').text();
    var destination = train.find('destNm').text();
  
    var timeOut = getTimeOut((train.find('arrT').text()).split(' ')[1]);
    
    var arrivalTime = formatTime((train.find('arrT').text()).split(' ')[1]);
    
    var detail = train.find('stpDe').text();
    
    var route = train.find('rt').text();
    
    var isApproaching = train.find('isApp').text();
    var isSchedule = train.find('isSch').text();
    var isDelayed = train.find('isDly').text();
    var isFaulty = train.find('isFlt').text();
    // building result header
    if(isApproaching == '1') {
      timeOut = 'Due';
    }
    var headerText =  destination + ' - ' + timeOut;

    trainHtml += '<h5 class="result-header ' + route + '" id="header-' + run + '">' + headerText + '</h5>';

    var descriptionHtml = '<div class="arrival-desc">' + detail + '</div>';
    var arrivalHtml = '<div class="arrival-time">Arriving at ' + arrivalTime + '</div>';
    var scheduledNote = '';
    if(isSchedule == 1) {
      scheduledNote = '<div class="notice">* Live Data Not Available, Using Scheduled Times</div>'
    }
    trainHtml += '<div class="result-body" id="body-' + run + '">' + descriptionHtml + arrivalHtml + scheduledNote + '</div>';
    trainHtml += '</div>';
    resultsHtml += trainHtml;
  });

  return resultsHtml;
}

