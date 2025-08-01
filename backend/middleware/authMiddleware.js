// // backend/middleware/authMiddleware.js
// const { auth } = require('../config/firebase-admin'); // Firebase Admin Auth for token verification

// const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   const idToken = authHeader.split('Bearer ')[1];

//   try {
//     const decodedToken = await auth.verifyIdToken(idToken);
//     req.user = decodedToken; // Attach Firebase user info (uid, email, etc.) to the request
//     next();
//   } catch (error) {
//     console.error("Error verifying ID token:", error);
//     res.status(403).json({ message: 'Unauthorized: Invalid token.', error: error.message });
//   }
// };

// module.exports = authenticate;



// backend/middleware/authMiddleware.js
const { auth } = require('../config/firebase-admin'); // Firebase Admin SDK

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    // Log UID for visibility (optional)
    console.log(`Authenticated UID: ${decodedToken.uid}`);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || '',
      phoneNumber: decodedToken.phone_number || '',
    };

    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(403).json({ message: 'Unauthorized: Invalid token.', error: error.message });
  }
};

module.exports = authenticate;
