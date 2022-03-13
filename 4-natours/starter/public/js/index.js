import "@babel/polyfill";
import { login, logout } from "./login";
import { display_map } from "./mapbox";
import { update_setting } from "./updateSettings";
import { book_tour } from "./stripe";

const login_from = document.querySelector(".form--login");
const logout_btn = document.querySelector(".nav__el--logout");
const form_user_data = document.querySelector(".form-user-data");
const form_user_password = document.querySelector(".form-user-settings");
const book_btn = document.getElementById("book-tour");

const mapBox = document.getElementById("map");
if(mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log(locations)
    display_map(locations)
}

if(login_from) {
    login_from.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
    
        login(email, password)
    });
}

if(logout_btn) logout_btn.addEventListener("click", logout)

if(form_user_data) {
    form_user_data.addEventListener("submit", e => {
        e.preventDefault();
        const form = new FormData();
        form.append("name", document.getElementById("name").value);
        form.append("email", document.getElementById("email").value);
        form.append("photo", document.getElementById("photo").files[0]);
            
        update_setting(form, "data")
    });
}

if(form_user_password) {
    form_user_password.addEventListener("submit", async e => {
        e.preventDefault();
        const btn_save_password = document.querySelector(".btn--save-password");
        const oldPassword = document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm = document.getElementById("password-confirm").value;

        btn_save_password.textContent = "Updating ..."
    
        await update_setting({oldPassword, password, passwordConfirm}, "password")

        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("password-confirm").value = ""; 
        btn_save_password.textContent = "SAVE PASSWORD"
    });
}

if(book_btn) {
    book_btn.addEventListener("click", e => {
        e.target.textContent = "Processing..."

        const tour_id = e.target.dataset.tour_id;
        book_tour(tour_id);
    })
}