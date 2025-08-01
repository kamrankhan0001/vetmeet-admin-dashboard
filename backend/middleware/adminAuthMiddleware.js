// const { auth } = require('../config/firebase-admin');
// const User = require('../models/User');

// const adminAuth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   console.log('Admin Auth Middleware: Received request.');
//   console.log('Authorization Header:', authHeader); // Check if header is present

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     console.log('Admin Auth Middleware: No token or invalid format.');
//     return res.status(401).json({ message: 'Unauthorized: No token provided' });
//   }

//   const idToken = authHeader.split('Bearer ')[1];
//   console.log('Admin Auth Middleware: Extracted token:', idToken ? idToken.substring(0, 20) + '...' : 'N/A'); // Log partial token

//   try {
//     const decodedToken = await auth.verifyIdToken(idToken);
//     req.user = decodedToken;
//     console.log('Admin Auth Middleware: Token decoded. UID:', decodedToken.uid);

//     const userDoc = await User.findOne({ firebaseUid: req.user.uid });
//     console.log('Admin Auth Middleware: MongoDB userDoc found:', !!userDoc); // Check if userDoc exists

//     if (!userDoc) {
//       console.log('Admin Auth Middleware: User profile not found in DB for UID:', req.user.uid);
//       return res.status(404).json({ message: 'User profile not found in database. Please ensure the user exists and is synced.' });
//     }

//     console.log('Admin Auth Middleware: User role from DB:', userDoc.role); // Check the role

//     if (userDoc.role !== 'admin') {
//       console.log('Admin Auth Middleware: User is not admin. Role:', userDoc.role);
//       return res.status(403).json({ message: 'Forbidden: Admin access required.' });
//     }

//     req.mongoUser = userDoc;
//     console.log('Admin Auth Middleware: Admin user authenticated. Proceeding.');
//     next();
//   } catch (error) {
//     console.error("Admin Auth Middleware: Error:", error); // Log the full error
//     res.status(403).json({ message: 'Unauthorized: Invalid token or access denied.', error: error.message });
//   }
// };

// module.exports = adminAuth;



// backend/middleware/adminAuth.js
const { auth } = require('../config/firebase-admin');
const User = require('../models/User');

const MOCK_TOKEN = 'MOCK_FIREBASE_ID_TOKEN_FOR_ADMIN';

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Admin Auth Middleware: Received request.');
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Admin Auth Middleware: No token or invalid format.');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log('Admin Auth Middleware: Extracted token:', idToken ? idToken.substring(0, 20) + '...' : 'N/A');

  // ✅ Skip Firebase verification if it's the mock token
  if (idToken === MOCK_TOKEN) {
    console.log('Admin Auth Middleware: Mock token detected. Skipping Firebase verification.');

    // Simulate decodedToken and userDoc for mock token
    req.user = { uid: 'mock-admin-uid', email: 'kamran@gmail.com' };
    req.mongoUser = {
      firebaseUid: 'mock-admin-uid',
      email: 'kamran@gmail.com',
      role: 'admin',
      name: 'Mock Admin'
    };

    return next();
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    console.log('Admin Auth Middleware: Token decoded. UID:', decodedToken.uid);

    const userDoc = await User.findOne({ firebaseUid: decodedToken.uid });
    console.log('Admin Auth Middleware: MongoDB userDoc found:', !!userDoc);

    if (!userDoc) {
      console.log('Admin Auth Middleware: User profile not found in DB for UID:', decodedToken.uid);
      return res.status(404).json({ message: 'User profile not found in database. Please ensure the user exists and is synced.' });
    }

    console.log('Admin Auth Middleware: User role from DB:', userDoc.role);

    if (userDoc.role !== 'admin') {
      console.log('Admin Auth Middleware: User is not admin. Role:', userDoc.role);
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }

    req.mongoUser = userDoc;
    console.log('Admin Auth Middleware: Admin user authenticated. Proceeding.');
    next();
  } catch (error) {
    console.error("Admin Auth Middleware: Error:", error);
    res.status(403).json({ message: 'Unauthorized: Invalid token or access denied.', error: error.message });
  }
};

module.exports = adminAuth;
