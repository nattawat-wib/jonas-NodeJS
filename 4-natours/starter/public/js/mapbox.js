export const display_map = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibnV0ZWxsYS13aWIiLCJhIjoiY2wwbnk5N2U4MWpiNTNkbnNybGxwcTRrOCJ9.ahm_w8GdQag94SAQ2xtC4w';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/nutella-wib/cl0pgmji8001514n0edv0ejyt', // style URL
        scrollZoom: false,
        // center: [-74.5, 40], // starting position [lng, lat]
        // zoom: 10, // starting zoom
        // interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create Marker
        const el = document.createElement("div")
        el.className = "marker";

        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);

        // Add popup
        new mapboxgl
            .Popup({
                offset: 30
            })
            .setLngLat(loc.coordinates)
            .setHTML(`<p> Day ${loc.day}: ${loc.description} </p>`)
            .addTo(map);

        // Extend map
        bounds.extend(loc.coordinates)
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 200,
            left: 100,
            right: 100
        }
    });
}