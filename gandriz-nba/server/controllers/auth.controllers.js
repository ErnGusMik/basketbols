const routes = require("./../routes/auth.routes");

const express = require("express");
const router = express.Router();

router.post("/login", routes.loginVerify);

router.post("/token", routes.token)

router.post("/signup", routes.signUp);

router.post("/refresh", routes.refresh);

module.exports = router;