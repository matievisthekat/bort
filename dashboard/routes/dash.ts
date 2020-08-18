import { Router } from "express";
const router = Router();

router.get("/:id", (req, res) => {
  res.render("dashboard", { id: req.params.id });
});

module.exports = router;
