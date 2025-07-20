const express = require("express");
const router = express.Router();

const { ensureUser, 
  setUserRole, 
  getAllUsers   
} = require("../controllers/user-controller");

router.post("/ensure-user", ensureUser);
router.get("/", getAllUsers);
router.patch("/set-role", setUserRole);

module.exports = router;
 