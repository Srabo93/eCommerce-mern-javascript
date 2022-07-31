import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "10 days",
  });
};

export default generateToken;
