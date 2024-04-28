const express = require('express');
const app = express();

const userRoutes = require('./routes/User'); // Assuming User is your user-related routes
const profileRoutes = require('./routes/Profile'); // Assuming Profile is your profile-related routes
// const paymentRoutes = require('./routes/Payments'); // Uncomment if needed
const courseRoutes = require('./routes/Course'); // Assuming Course is your course-related routes

const database = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const { cloudinaryConnect } = require('./config/cloudinary'); // Uncomment if needed
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 4000;

// Database connect
database.connect();

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Corrected to cookieParser()
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// Cloudinary connection
// cloudinaryConnect(); // Uncomment if needed

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes); // Uncomment if needed

// Default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running..."
    });
});
