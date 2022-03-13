import axios from "axios";
import { show_alert } from "./alert";

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
                email,
                password
            },
        })
        console.log("res", res)

        if(res.data.status === "success") {
            show_alert("success", "Loggen in successfully");
            window.setTimeout(() => { location.assign("/") }, 1500)
        }

    } catch (e) {
        show_alert("error", e.response.data.message)
    }

}

