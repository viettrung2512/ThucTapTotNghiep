const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '⚠️ Token không được cung cấp hoặc không hợp lệ' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded JWT token payload:", decoded);
    // Ensure req.user.userId exists for compatibility
    if (decoded.userId) {
      req.user = decoded;
    } else if (decoded.id) {
      req.user = { userId: decoded.id, ...decoded };
    } else if (decoded._id) {
      req.user = { userId: decoded._id, ...decoded };
    } else {
      req.user = decoded;
    }
    next();
  } catch (err) {
    // ⛔ Token hết hạn
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '⏰ Token đã hết hạn, vui lòng đăng nhập lại' });
    }

    // ⛔ Token sai định dạng hoặc không đúng
    return res.status(403).json({ message: '⛔ Token không hợp lệ' });
  }
};

module.exports = verifyToken;
