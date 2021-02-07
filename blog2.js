//BASEMAP ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//  osm
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
        params: {'LAYERS':'gis_lab:minus_null_tiles'}
    }),
    opacity:0.8,
    visible:false

});


// GHS reclass
var GHS_reclass = new ol.layer.Image({
    title: 'GHS reclassified',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:ghs_reclass','STYLES':''}
    }),
    opacity:0.8,
    visible:false

});



// World POP reclass
var WorldPOP_reclass = new ol.layer.Image({
    title: 'WorldPOP reclassified',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:WorldPOP_reclass '}
    }),
    opacity:0.8,
    visible:false

});


// diff reclass 3 scenarios
var diff_reclass = new ol.layer.Image({
    title: 'Diffecence - 3 scenario',
    source: new ol.source.ImageWMS({
        url: 'http://localhost:8082/geoserver/wms',
        params: {'LAYERS':'gis_lab:diff_reclass'}
    }),
    opacity:0.8,
    visible:true

});



// Not interactive tiles
var vectorSource = new ol.source.Vector({
    loader: function(extent, resolution, projection){
        var url = 'http://localhost:8082/geoserver/gis_lab/ows?service=WFS&' +
         'version=2.0.0&request=GetFeature&typeName=gis_lab:sampling_points&' + 
         'outputFormat=text/javascript&srsname=EPSG:3857&' + 
         'format_options=callback:loadFeatures';
    $.ajax({url:url, dataType: 'jsonp'});
    }
});

var geojsonFormat = new ol.format.GeoJSON();
function loadFeatures(response){
    vectorSource.addFeatures(geojsonFormat.readFeatures(response));
}

var samplingPoints = new ol.layer.Vector({
    title: 'Sampling points',
    source: vectorSource,
    visible:true
    
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
        layers: [corrTiles, GHS_reclass, WorldPOP_reclass, diff_reclass, samplingPoints]
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


function name_class(number) {
if (number == 2){
    return 'Urban';
} else if (number == 1) {
    return 'Not urban';
}
}


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
        $(elementPopup).attr('title', 'Sampling points'); 
        $(elementPopup).attr('data-content', '<b>Id: </b>' + feature.get('fid') + '<hr>' +
        '<b>GHS: </b>' + name_class(feature.get('GHS')) + 
        '</br><b>World Pop: </b>' + name_class(feature.get('World_POP')) + 
        '</br><b>Foto: </b>' + name_class(feature.get('foto')));
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


