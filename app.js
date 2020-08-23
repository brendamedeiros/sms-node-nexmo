const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const Nexmo = require("nexmo");
const socketio = require("socket.io");

dotenv.config({ path: "./config.env" });

// Init Nexmo
const nexmo = new Nexmo(
    {
        apiKey: process.env.NEXMO_APIKEY,
        apiSecret: process.env.NEXMO_APISECRET,
    },
    {
        debug: true,
    }
);

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Index route
app.get("/", (req, res) => {
    res.status(200).render("index", {
        title: "Node SMS Texting",
    });
});

// Catch form submit
app.post("/", (req, res, next) => {
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        "Vonage APIs",
        number,
        text,
        { type: "unicode" },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.dir(responseData);
                // get data from response
                const data = {
                    id: responseData.messages[0]["message-id"],
                    number: responseData.messages[0]["to"],
                };

                // Emit to the client
                io.emit("smsStatus", data);
            }
        }
    );
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Connect to socket.io
const io = socketio(server);
io.on("connection", (socket) => {
    console.log("Connected");
    io.on("disconnect", () => {
        console.log("Disconnected");
    });
});
