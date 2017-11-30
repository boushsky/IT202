document.addEventListener('DOMContentLoaded', function() {
  var api_key = '0d49b01cdbb6409d944b1d5ad2c5e450';
  var base_url = 'https://polar-garden-75406.herokuapp.com/apiPassThru.php?apiEndpoint=http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx&outputType=JSON';

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
    var request_url = base_url + '&key=' + api_key;
    request_url += '&mapid=' + $('#stop-select').val(); 
    var resultHeader = 'For train arrivals at ' + $('#stop-select option:selected').text();
    
    $.getJSON(request_url, function (response) {
      var resultsHtml = '<h4>' + resultHeader + '</h4><hr>';
 
      $.each(response.ctatt.eta,function(i,v){
        //console.log(response.ctatt.eta[0]);
        
        var clone = $("#card").clone();
                   clone.find(".card .card-body .card-title").text(v.rt+" line");
                   clone.find(".card .list-group .stopDe").text(v.stpDe);
                   clone.find(".card .card-block .arrTime").text(v.arrT);
                   
                   clone.attr("id",v.heading);
                   $("#card").append(clone);
        
      });
      $("#results").html(resultsHtml + '<br>');
    });
  });
  

  $(document).on('click',function () {this.id})}, false);




