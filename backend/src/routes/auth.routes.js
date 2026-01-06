import { Router } from "express";
import { 
    changeCurrentPassword,
    loginUser, 
    logoutUser, 
    registerUser, 
    updateAccountDetails
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails); // New
router.route("/change-password").post(verifyJWT, changeCurrentPassword); // New

export default router;