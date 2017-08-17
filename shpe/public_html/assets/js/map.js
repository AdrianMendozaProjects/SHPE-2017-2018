var map;
jQuery(document).ready(function(){

    map = new GMaps({
        div: '#map',
        lat: 32.879641,
        lng: -117.236755,
    });
    map.addMarker({
        lat: 32.879641,
        lng: -117.236755,
        title: 'Address',      
        infoWindow: {
            content: '<h5 class="title">UC San Diego</h5><p><span class="region">9500 Gilman Dr. #0429</span><br><span class="postal-code">La Jolla, CA 92093</span><br><span class="country-name">US</span></p>'
        }
        
    });

});