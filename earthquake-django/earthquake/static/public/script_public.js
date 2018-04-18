mapboxgl.accessToken = 'pk.eyJ1IjoiZW5kcmVocCIsImEiOiJjamRsNmlvZjYwM3RqMnhwOGRneDhhc2ZkIn0.wVZHznNCtC5_gJAnLC2EJQ';

console.log('begynn igjen')
    
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
  maxZoom: 9
});


map.on('load', function() {
    
    document.querySelector('.new-data').addEventListener('click', function () {
    
    if (l > 0) {
    map.removeLayer('earthquake' + l);
    };  
    l += 1
    url = 'media/public_' + title + '.geojson';
    speed = document.getElementById('speed').value;
    add_data()
    });
    
    
document.getElementById('slider').addEventListener('input', function(e) {
  Time = parseInt(e.target.value);
    i = Time;
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
	}});

});

function add_data() {
//setEndTime();
 
    map.addLayer({
      id: 'earthquake' + l,
      type: 'circle',
      source: {
        type: 'geojson',
        data: url, 
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
    
reset();
};


function updateLayer(Time) {
    map.setFilter('earthquake'+ l, ['==', ['number', ['get', 'Time']], Time]);    
    document.getElementById('active-hour').innerText = Time;
    
};

function play_b() {

if (play == false) {
v = [];
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
    };

function select_earthquake(e) {
    for (var i=0; i < document.getElementsByClassName('table_row').length; i++){
        document.getElementsByClassName('table_row')[i].style.background = 'white';
        document.getElementsByClassName('table_row')[i].style.color = 'black';
    };
    e.style.background = 'black';
    e.style.color = 'white';
    title = e.getElementsByClassName('title')[0].innerText;
};