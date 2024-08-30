// Create the map
let myMap = L.map("map").setView([37.7749, -122.4194], 5); // Centralizado nos EUA
        
// Create the tile layer that will be the background of our map.
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(myMap);

// URL - GeoJSON API
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Função para definir cor baseado na profundidade
function markerColor(depth) {
    return depth > 90 ? '#FF0000' :
           depth > 70 ? '#ff5100' :
           depth > 50 ? '#ffb300' :
           depth > 30 ? '#ffe600' :
           depth > 10 ? '#baff2f' :
                        '#48ff00' ;
}

// Function to create Markers with size of earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 6; 
}

// Loading GeoJSON data
d3.json(geoData).then(function(data) {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function(feature) {
            return {
                radius: getRadius(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 1
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
    
        }
    }).addTo(myMap);

    // Create a legend to display information about our map.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        depth = [-10, 10, 30, 50, 70, 90];
        div.innerHTML += '<div class="legend-labels">';
        div.innerHTML += '</div>';

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + markerColor(depth[i] + 1) + '; width: 18px; height: 18px; display: inline-block;"></i> ' + 
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
});