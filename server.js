require("dotenv").config();
const express = require("express");
const http = require("http");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const postRoutes = require("./routes/postRoutes");
// const commentRoutes = require("./routes/commentRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Swagger config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BEL Medical Application API",
      version: "1.0.0",
      description: "API documentation for a medical application",
    },
    servers: [{ url: `http://localhost:${PORT}`, description: "Local server" }],
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
app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("BEL Medical API is running...");
});


connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 SERVER RUNNING ON http://localhost:${PORT}`)
  );
});
