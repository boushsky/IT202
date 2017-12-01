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
    
    $.getJSON(request_url, function (data) {
      var resultsHtml = '<h4>' + resultHeader + '</h4><hr>';
      $(".result").html(data);
      
      $.each(data,function(i,v){
        console.log(v);
        $(".card .card-block .card-title").text(v.eta[0].rt+" line");
        $(".card .list-group .stopDe").text(v.eta[0].stpDe);
        $(".card .list-group .arrTime").text("Arrive at "+v.eta[0].arrT);
        
        
        var clone = $("#template").clone();
                   clone.find(".card .card-block .card-title").text(v.eta.rt+" line");
                   clone.find(".card .list-group .stopDe").text(v.eta.stpDe);
                   clone.find(".card .list-group  .list-group .arrTime").text(v.eta.arrT);
                   
                   clone.attr("id",v.eta.heading);
                   $("#card").append(clone);
        
      });
      
      
      
  $("#btnSearch2").on("click", initMap);
      
      $("#results").html(resultsHtml + '<br>');
    });
  });
  

  $(document).on('click',function () {this.id})}, false);


function initMap() {
        var uluru = {lat: -25.363, lng: 131.044};
        var request_url = base_url + '&key=' + api_key;
        request_url += '&mapid=' + $('#stop-select').val();
        $.get(request_url, function(response) {
           
           var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 9,
              center: {lat: parseFloat(response[0].lat), lng: parseFloat(response[0].lon)}
            });
           
           
           $.each(response, function(i,v) {
              
              var contentString = "<h2>" + v.service_request_number
                    + "</h2><br>" + v.street_address
                    + "<br>" + v.status;
              
              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });
      
              var marker = new google.maps.Marker({
                position: {lat: parseFloat(v.lat), lng: parseFloat(v.lon)},
                map: map,
                title: 'Uluru (Ayers Rock)'
              });
              
              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });             
             
           });
        
      });

}

