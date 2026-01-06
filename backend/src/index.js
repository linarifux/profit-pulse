import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ... imports
import authRouter from './routes/auth.routes.js'
import dashboardRouter from "./routes/dashboard.routes.js";
import integrationRouter from "./routes/integration.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

dotenv.config();

const app = express();

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });

// Configuration for incoming data
app.use(cors({
    // Use an array to allow both Production (Netlify) and Development (Localhost)
    origin: ["https://profit-pulse1.netlify.app", "http://localhost:5173", "https://profit-pulse-chi.vercel.app"],
    credentials: true // Crucial for cookies to work
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
// import userRouter from './routes/user.routes.js'

app.get('/', (req, res) => {
    res.send('hello express')
})

// Routes declaration
app.use("/api/v1/users", authRouter)
app.use("/api/v1/dashboard", dashboardRouter); 
app.use("/api/v1/integrations", integrationRouter); 
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/analytics", analyticsRouter);