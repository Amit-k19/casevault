import jwt from "jsonwebtoken";

// Render hint for Boss: a JWT is like a wristband at a concert. Once the
// gate (login) verifies you, you get a wristband (token). After that, you
// just show the wristband instead of your ID every single time.

const JWT_SECRET = process.env.JWT_SECRET;

// Called right after a successful login/register to create a wristband.
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Checks if a wristband is real (and not expired). Throws if it's fake.
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Used inside protected API routes (upload, edit, delete).
// Reads the "Authorization: Bearer <token>" header sent by the frontend,
// and returns the logged-in user's info, or null if there's no valid token.
export function getUserFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}
