export const hide_alert = () => {
    const el = document.querySelector(".alert");
    if(el) el.parentElement.removeChild(el);
}

export const show_alert = (type, msg, time = 7) => {
    hide_alert();

    const markup = `<div class="alert alert--${type}"> ${msg} </div>`
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

    window.setTimeout(hide_alert, time * 1000)
}