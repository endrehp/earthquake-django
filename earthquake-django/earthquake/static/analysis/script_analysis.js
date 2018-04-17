mapboxgl.accessToken = 'pk.eyJ1IjoiZW5kcmVocCIsImEiOiJjamRsNmlvZjYwM3RqMnhwOGRneDhhc2ZkIn0.wVZHznNCtC5_gJAnLC2EJQ';

console.log('begynn igjen')

    
var select;
//var select2;
window.onload = function () {

    
    select2 = document.getElementById('dropdown2');
    for(var i = 0; i < modes.length ; i++) {
        var option = document.createElement('option');
        option.text = option.value = modes[i];
        select2.add(option, 0);
    }
}




function changeHiddenInput2(objDropDown) {
    //console.log(objDropDown);
    var objHidden = document.getElementById("hiddenInput2");
    objHidden.value = objDropDown.value;
    var a = objHidden.value;
    mode= a;
}


var modes = ['public', 'private'];


var mode = 'public';
var l = 0;
var v =[];
var i;
var Time;
var url; //= mode + '_' + earthquakeDate;
var play = false;
var b;
var a;
var endTime = 700;
var speed = 10;
var title;

 

var map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-98.2022, 16.6855], // initial map center in [lon, lat]
  zoom: 5.5,
  maxZoom: 8
});



map.on('load', function() {
    
    
    document.querySelector('.new-data').addEventListener('click', function () {
    
    if (l > 0) {
    map.removeLayer('earthquake' + l);
    map.removeLayer('act' + l)
    
    }
        
    l += 1
        
    if (mode == 'private') {
        url = 'media/private_' + title + '.geojson';
    }
    else {
        url = 'media/public_' + title + '.geojson';
    }
    //url = mode + '_' + earthquakeDate;
    //url
    //a = $.getJSON(url + '.geojson', function (data) {
    //b = data;})
    //document.getElementById('date').textContent = earthquakeDate; 
    //setEndTime();
    speed = document.getElementById('speed').value;
    
    console.log('legg til noe')
    add_data()
    
    });
    
    
document.getElementById('slider').addEventListener('input', function(e) {
  Time = parseInt(e.target.value);
    i = Time;
  // update the map
  updateLayer(Time)  
});


document.querySelector('.btn-pause').addEventListener('click', function() { 
    if (l > 0) {
        pause();}});

document.querySelector('.btn-reset').addEventListener('click', function() {
    if (l > 0) {
    reset();}});

document.querySelector('.btn').addEventListener('click', function() {
    if (l > 0 && play == false ){
    play_b();} else if (l>0 && play == true){
		pause();
		//btn.toggleClass("btn-pause");
		//return false; 
		
	}});

});

function add_data() {
//setEndTime();
 
    map.addLayer({
      id: 'earthquake' + l,
      type: 'circle',
      source: {
        type: 'geojson',
        data: url, //replace this with the url of your own geojson
      },
      paint: {
        'circle-radius':
             
          [
            'interpolate',
          ['linear'],
          ['number', ['get', 'S_Gal']],
        0, 6,
        5, 16,
        10, 20,
        50, 25,
        100, 30
        ],
        
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'S_Gal']],
          0, '#000000',
          5, '#b8ecff',
          10,'#05bcff',
          15,'#2fff05',
          25,'#ffd505',
          50,'#ff9f05',
          75,'#ff6d05',
          100,'#ff0505',
          150,'#C70000'
            
          
        ],
        
        'circle-opacity': 0.8
      }
    }, 'admin-2-boundaries-dispute');
    

if (mode == 'private') {
    private_version();
}
setMaxZoom();
reset();
};


function updateLayer(Time) {
    //map.setFilter('earthquake'+l, ['==', ['number', ['get', 'show']], 1] )
    map.setFilter('earthquake'+ l, ['==', ['number', ['get', 'Time']], Time]);
    if (mode == 'private'){
    map.setFilter('act' + l, ['==', ['number', ['get', 'Time']], Time]);
    }
        
    document.getElementById('active-hour').innerText = Time;
    
};

function play_b() {

if (play == false) {
v = [];
//document.querySelector('.btn-new').classList.remove();
    //document.querySelector('.player-1-panel').classList.remove('active');

for (var j=0; j < endTime; j++) {
    
    v.push(setTimeout( function () {
        
        document.getElementById('slider').value=i;
        Time = i;
        
        i++;
        updateLayer(Time) }, j*1000/speed));
    }
    play = true;
}
    
};

function reset() { 
    
    pause();
    
    
    i = 0;
    document.getElementById('slider').value=i;
    Time = i;
    updateLayer(Time);
};

function pause() { 
    if (v.length > 0){
    for (var j = 0; j < v.length; j++){
          clearTimeout(v[j])}
    };
    play = false;
        
    };

function setEndTime() {
    $.getJSON(url, function (data) {
        b = data.features.length;
        endTime = data.features[b-1].properties['Time'];
    })
    for (var h = 0; h < 10;h++){
        document.getElementById('slider').max = endTime;
    };
    }

function setMaxZoom(){
    if (mode=='public'){
        map.setMaxZoom(9)
    }
    else 
        map.setMaxZoom(22)
    
}
function private_version() {
    map.addLayer({
      id: 'act' + l,
      type: 'circle',
      source: {
        type: 'geojson',
        data: url,//'./' + url + '.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-radius': 6,
          
        'circle-color': ["step",
            ['number', ['get', 'MdAct']] ,
            '#000000',
            0,'#000000',
            1, '#2fff05'
            
        ]
            
          
        ,
        'circle-opacity': 0.8
      }
    }, 'admin-2-boundaries-dispute');



    
    map.on('click', 'earthquake' + l, function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var serial_number = e.features[0].properties.Sn;
        var description = e.features[0].properties.Description + 
            '<button class="hide_sensor"> Hide sensor </button>'
            ;
        
      
        
        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        
        /*
        document.querySelector('.hide_sensor').addEventListener('click', function() {
            //e.features[0].properties.Description = 'trist'
            console.log('pressed')
            $.getJSON(url + '.geojson', function (data) {
            b = data.features;
            
            for (var i = 0; i < b.length; i++) {
                if (b[i].properties.Sn == serial_number) {
                    b[i].properties.Description = '<p> hidden </p>';
                    console.log('hei')
                } 
                
                
            }
    })
      
            
    })
          */
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
    });
    
};



function select_earthquake(e) {
    
    
    
    for (var i=0; i < document.getElementsByClassName('table_row').length; i++){
        //console.log(document.getElementsByClassName('table_row')[i].innerHTML)
        document.getElementsByClassName('table_row')[i].style.background = 'white';
        document.getElementsByClassName('table_row')[i].style.color = 'black';
        
    
    }
        
    e.style.background = 'black';
    e.style.color = 'white';
    
    title = e.getElementsByClassName('title')[0].innerText;
    
    
    //var p = document.getElementById('para');
    //p.innerHTML = 'You clicked on cell:' + ' ' + e.innerText;
    //console.log(e.innerText)
    //console.log(e.innerHTML)
    /*
    if (mode == 'private') {
        url = e.getElementsByClassName('private_url')[0].innerText;    
    }
    else {
        url = e.getElementsByClassName('public_url')[0].innerText;
    }
    */
    //url = 'media/public_' + e.innerText + '.geojson';
    //console.log(e.innerText)
    //html_string = e.innerHTML;
    //url = $(html_string)[4]
    
}



