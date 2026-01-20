import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar gereklidir'
      });
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Geçerli bir email adresi girin"
      });
    }

    const existingUser = await User.findOne({ email }).select('-password');

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Bu email zaten kayıtlı"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Şifre en az 8 karakter uzunluğunda olmalıdır"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: String(email).trim(),
      password: passwordHash,
      fullName: String(fullName).trim()
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      },
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Kayıt işlemi sırasında bir hata oluştu.'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email ve şifre gereklidir'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Giriş işlemi sırasında bir hata oluştu.'
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax'
    });

    return res.status(200).json({
      success: true
    });

  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      success: false,
      message: 'Çıkış işlemi sırasında bir hata oluştu.'
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userData.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Kullanıcı bulunamadı"
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      }
    });

  } catch (err) {
    console.error('CheckAuth error:', err);
    return res.status(500).json({
      success: false,
      message: 'Bir hata oluştu'
    });
  }
};