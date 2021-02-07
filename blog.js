





//BASEMAP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// osm
var osm = new ol.layer.Tile({
    title: 'OpenStreetMap',
    type: 'base',
    visible: true,

    source: new ol.source.OSM()
});


//bing
var bingroads = new ol.layer.Tile({
    title: 'Bing Maps-Roads',
    type: 'base',
    visible:false,

    source: new ol.source.BingMaps({
        key:'ArEJvSonOP3aQc14As5RyCZtiT1hHaQU9c_nIIBUhefij0fsocnJVcxcMMEk5EPV',
        imagerySet: 'Road'
    })
});


var bingaerial = new ol.layer.Tile({
    title: 'Bing Map-Aerial',
    type: 'base',
    visible:false,

    source: new ol.source.BingMaps({
        key:'ArEJvSonOP3aQc14As5RyCZtiT1hHaQU9c_nIIBUhefij0fsocnJVcxcMMEk5EPV',
        imagerySet: 'Aerial'
    })
});



var bingaerialwithlabels = new ol.layer.Tile({
    title: 'Bing Map-Aerial with labels',
    type: 'base',
    visible:false,

    source: new ol.source.BingMaps({
        key:'ArEJvSonOP3aQc14As5RyCZtiT1hHaQU9c_nIIBUhefij0fsocnJVcxcMMEk5EPV',
        imagerySet: 'AerialWithLabels'
    })
});


//stamen

var stamenterrain = new ol.layer.Tile({
    title: 'Stamen Terrain',
    type: 'base',
    visible:false,

    source: new ol.source.Stamen({
        layer: 'terrain'
    })
});



//LAYERS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Not interactive tiles
var corrTiles = new ol.layer.Image({
    title: 'Correlation tiles',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:minus_null_tiles','STYLES':'corr_tiles'}
    }),
    opacity:0.8

});


// map of the differences
var diffMap = new ol.layer.Image({
    title: 'Map of differences',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:map_of_differences'}
    }),
    opacity:0.8

});



// GHS layer
var GHS = new ol.layer.Image({
    title: 'GHS Preprocessed',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:GHS_POP_final32Int'}
    }),
    opacity:0.8,
    visible:false

});


// WORLD POP layer
var WORLDPOP = new ol.layer.Image({
    title: 'WorldPop Preprocessed',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:WorldPOP_final32Int'}
    }),
    opacity:0.8,
    visible:false

});



// Not interactive tiles
var vectorSource = new ol.source.Vector({
    loader: function(extent, resolution, projection){
        var url = 'http://localhost:8082/geoserver/gis_lab/ows?service=WFS&' +
         'version=2.0.0&request=GetFeature&typeName=gis_lab:correlation_tiles&' + 
         'outputFormat=text/javascript&srsname=EPSG:3857&' + 
         'format_options=callback:loadFeatures';
    $.ajax({url:url, dataType: 'jsonp'});
    }
});

var geojsonFormat = new ol.format.GeoJSON();
function loadFeatures(response){
    vectorSource.addFeatures(geojsonFormat.readFeatures(response));
}

var corrTilesWFS = new ol.layer.Vector({
    title: 'Correlation tiles WFS',
    source: vectorSource
    
});





//container ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var map = new ol.Map({
    target: document.getElementById('map'),
    layers: [


    // list of basemaps
    new ol.layer.Group({
        title: 'Base Maps',
        layers: [osm, bingroads, bingaerial, bingaerialwithlabels, stamenterrain]
    }),

    // list of layers
    new ol.layer.Group({
        title: 'Layers',
        layers: [corrTilesWFS ,corrTiles, diffMap, GHS, WORLDPOP]
    })




    ],

    view: new ol.View({
        center:ol.proj.fromLonLat([-110,20]),
        zoom: 2.5
    }),
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.FullScreen(),
        new ol.control.OverviewMap(),
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326'
        })
    ])
    
});

var layerSwitcher = new ol.control.LayerSwitcher({});
map.addControl(layerSwitcher);


// +++++++++++++++++++++++++++++++++++++++++ ADDITIONAL ELEMENTS +++++++++++++++++++++++++++++++++++++++++++++++++






//popup ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var elementPopup = document.getElementById('popup');

var popup = new ol.Overlay({
    element: elementPopup
});

map.addOverlay(popup);

// display info popup
map.on('click', function(event) {
    var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
    return feature; 
});
    if (feature != null) {
        var pixel = event.pixel;
        var coord = map.getCoordinateFromPixel(pixel);
        popup.setPosition(coord);
        $(elementPopup).attr('title', 'Correlation tile'); 
        $(elementPopup).attr('data-content', '<b>Id: </b>' + feature.get('tileID') + 
        '</br><b>Description: </b>' + feature.get('Correlatio')); 
        $(elementPopup).popover({'placement': 'bottom', 'html': true}); 
        $(elementPopup).popover('show');
    } 
});


//hand pointer (features) +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
map.on('pointermove', function(event) { 
    if (event.dragging) {
        $(elementPopup).popover('destroy');
        return; 
    }

    var pixel = map.getEventPixel(event.originalEvent); 
    var hit = map.hasFeatureAtPixel(pixel); 
    map.getTarget().style.cursor = hit ? 'pointer' : '';

});



// table of content +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
map.on('click', function(event) { 
    document.getElementById('get-feature-info').innerHTML = '';
    var viewResolution = (map.getView().getResolution());
    var url = corrTiles.getSource().getFeatureInfoUrl(event.coordinate, viewResolution, 'EPSG:3857', {'INFO_FORMAT': 'text/html'});
    if (url)
        document.getElementById('get-feature-info').innerHTML = '<iframe seamless src="' + url + '"></iframe>'; 
});





