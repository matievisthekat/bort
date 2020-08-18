import { Router } from "express";
const router = Router();

router.get("/:id", (req, res) => {
  res.send(`Dashboard for ${req.params.id}`);
});

module.exports = router;
