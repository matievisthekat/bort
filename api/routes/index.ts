import { Router } from "express";
export const path = "/";
const router = Router();

router.get("/", (req, res) => res.json({ message: "Hello world" }));

export default router;