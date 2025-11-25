require("dotenv").config();
const express = require("express");
//const http = require("http");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const feedRoutes = require("./routes/feedRoutes");
const postRoutes = require("./routes/postRoutes");
const specialtyRoutes = require("./routes/specialtyRoutes");
// const postRoutes = require("./routes/postRoutes");
// const commentRoutes = require("./routes/commentRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   "http://localhost:3000",
//   "http://127.0.0.1:3000",
//   "http://localhost:5000",
//   "https://docnet.com.ng",
// ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Flutter mobile (and Postman, tools) have no Origin
      if (!origin) return callback(null, true);

      // Reject any request that actually has an origin (browser/web)
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // needed if using cookies
  })
);

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DocNet Medical Application API",
      version: "1.0.0",
      description: "API documentation for a medical application",
    },
    servers: [
      {
        url:
          `https://docnet-backend-b6a4.onrender.com/:${PORT}` ||
          `http://localhost:${PORT}`,
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/posts", postRoutes);
// app.use("/api/feed", feedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/specialty", specialtyRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("BEL Medical API is running...");
});

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(
      `🚀 SERVER RUNNING ON http://localhost:${PORT}` ||
        `https://docnet-backend-b6a4.onrender.com/:${PORT}`
    )
  );
});
