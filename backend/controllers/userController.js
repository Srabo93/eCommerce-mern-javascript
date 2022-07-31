import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

/**
 * @description Auth User & get token
 * @route POST /api/users/login
 * @access Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  const userAuthenticated = await user.matchPassword(password);

  if (user && userAuthenticated) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: null,
    });
  } else {
    res.status(401);
    throw new Error("Invalid user or password");
  }
});

export { authUser };
