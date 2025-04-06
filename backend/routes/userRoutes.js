import express from "express";
const router = express.Router();
import { registerUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import { updateUserProfile } from "../controllers/userController.js";
import { getUserDatasets } from "../controllers/userController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", updateUserProfile);
router.get("/datasets/:id", getUserDatasets);

export default router;
