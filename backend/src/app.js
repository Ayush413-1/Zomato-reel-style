const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');
const commentRoutes = require("./routes/comment.routes")

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://zomato-reel-style.vercel.app",
    "https://zomato-reel-style-63e14syxu-ayush-7330.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
};


app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
app.use("/api/comment", commentRoutes);


module.exports = app;