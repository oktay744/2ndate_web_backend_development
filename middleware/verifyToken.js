import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Oturum bulunamadı'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz oturum'
    });
  }
};