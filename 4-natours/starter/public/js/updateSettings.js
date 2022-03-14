import axios from "axios";
import { show_alert } from "./alert";

export const update_setting = async (data, type) => {
    try {
        const url = type === "password" ? "update-password" : "update-my-account";

        const res = await axios({
            method: "PATCH",
            url: `/api/v1/users/${url}`,
            data
        })

        if(res.data.status === "success") {
            show_alert("success", `${type.toUpperCase()} Update successfully`);
        }

    } catch (e) {
        show_alert("error", e.response.data.message)
    }
} 

