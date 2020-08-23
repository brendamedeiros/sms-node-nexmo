import "@babel/polyfill";
import axios from "axios";

const button = document.getElementById("button");
const response = document.querySelector(".response");

const send = async () => {
    const number = document.getElementById("number").value.replace(/\D/g, "");
    const text = document.getElementById("msg").value;

    try {
        const res = await axios({
            url: "/",
            method: "POST",
            data: {
                number,
                text,
            },
        });

        console.log(res);
    } catch (err) {
        console.log(err);
    }
};

button.addEventListener("click", send, false);

const socket = io();
socket.on("smsStatus", (data) => {
    response.innerHTML = `<h2>Text message sent to ${data.number} </h2>`;
});
