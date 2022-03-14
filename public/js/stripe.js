const stripe = Stripe("pk_test_51KcnSiKNT9DxG2cpUIVGnE3BQA5TBqCySBfvl5c81GlvfJ6DHVG8Uj7NS2qcKoTP6a2D4KBR6tAJKTvSW9q2T6gH00CAdkpacY");
import axios from "axios";
import { show_alert } from "./alert";

export const book_tour = async tour_id => {
    try {
        // 1) get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tour_id}`);

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (e) {
        show_alert("error", e)
    }
}