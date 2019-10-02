let url='https://api.wheretheiss.at/v1/satellites/25544'

let issLat=document.querySelector('#iss-lat')
let issLon=document.querySelector('#iss-lon')
let lastUpdate=document.querySelector('#time')

var issMarker
var update=10000

var icon=L.icon({
	iconUrl:'iss.png',
	iconSize:[50,50],
	iconAnchor:[25,25]
})

let max_failed_attempts=3

let map = L.map('iss-map').setView([0, 0], 1)  // Center at 0, 0 and max zoom out
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 7,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY2xhcmFsIiwiYSI6ImNqcmdwenViYTAwcHQ0Ym5yYmZ1Z3E2bjgifQ.QQfUvVaqPsWb_jJbP2gvHg'
}).addTo(map)

iss(max_failed_attempts)

function iss(attempts){
	if(attempts<=0){
		console.log('Too many errors, abandoning requests to get iss position.')
	}

	lastUpdate.innerHTML=Date()

	fetch(url)
		.then(res=>res.json())
		.then(issData=>{
			console.log(issData)
			let lat=issData.latitude
			let lon=issData.longitude
			issLat.innerHTML=lat
			issLon.innerHTML=lon

			if(!issMarker){
				issMarker=L.marker([lat,lon], {icon: icon}).addTo(map)
			}else{
				issMarker.setLatLng([lat,lon])
			}
		})
		.catch(err=>{
			console.log(err)
		})
		.finally(()=>{
			setTimeout(iss,update,attempts)
		})
}