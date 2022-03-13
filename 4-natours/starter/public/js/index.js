import "@babel/polyfill";
import { login } from "./login";
import { display_map } from "./mapbox";
import { show_alert } from "./alert";
import { hide_alert } from "./alert";

const login_from = document.querySelector(".form");
if(login_from) {
    login_from.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        login(email, password)
    });
}

const mapBox = document.getElementById("map");
if(mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log(locations)
    display_map(locations)
}
