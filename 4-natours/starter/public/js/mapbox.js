export const display_map = location => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibnV0ZWxsYS13aWIiLCJhIjoiY2wwbnk5N2U4MWpiNTNkbnNybGxwcTRrOCJ9.ahm_w8GdQag94SAQ2xtC4w';
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
}