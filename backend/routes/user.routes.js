import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUserForsidebar }from "../controllers/user.controller.js";

const router = express.Router();

router.get("/",protectRoute,getUserForsidebar);

export default router;