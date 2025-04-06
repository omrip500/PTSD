import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
const port = process.env.PORT || 5000;

const __dirname = path.resolve(); // set __dirname to the current directory

connectDB(); // Connect to MongoDB

const app = express();
// Body parser middlware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
// This middleware is used to allow cross-origin requests. It is used to allow the frontend to make requests to the backend. The origin is the URL of the frontend, and the credentials are set to true to allow cookies to be sent with the request.
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

if (process.env.NODE_ENV === "production") {
  // Set the frontend build folder as static, setting it static means that we can load the files inside the folder directly without having to create a route for it. Otherwise, we would have to create a route for it and then load the file in the route.
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // If the user goes to any route that is not defined, hw wil be sent to the index.html file in the frontend build folder, there he will be served the frontend.
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}
app.use(notFound);
app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
