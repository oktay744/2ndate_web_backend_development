import crypto from 'crypto';
import Couple from '../models/Couple.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';

const generateInviteKey = async () => {
  for (let i = 0; i < 10; i++) {
    const key = crypto.randomBytes(8).toString('base64url');
    const exists = await Couple.exists({ inviteKey: key });
    if (!exists) return key;
  }

  return crypto.randomBytes(12).toString('base64url');
};

export const createInvite = async (req, res) => {
  try {
    const userId = req.userData.id;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Önce kendi testini tamamlamalısın',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
      });
    }

    if (!user.fullName) {
      return res.status(400).json({
        success: false,
        message: 'İsim bilgini girmelisin',
      });
    }

    const inviteKey = await generateInviteKey();

    const invite = await Couple.create({
      userId,
      userName: user.fullName,
      partnerName: null,
      inviteKey,
      userAnswers: profile.answers,
      partnerAnswers: null,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      inviteKey,
      status: invite.status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Davet oluşturulurken bir hata oluştu.',
    });
  }
};

export const getInvite = async (req, res) => {
  try {
    const { inviteKey } = req.params;
    const couple = await Couple.findOne({ inviteKey }).select('status');

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Davet bulunamadı',
      });
    }

    return res.status(200).json({
      success: true,
      status: couple.status
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Davet bilgisi alınırken bir hata oluştu.',
    });
  }
};

export const completeInvite = async (req, res) => {
  try {
    const { inviteKey } = req.params;
    const { partnerName, partnerAnswers } = req.body;

    if (!partnerAnswers || Object.keys(partnerAnswers).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli cevaplar gereklidir',
      });
    }

    if (!partnerName || !partnerName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'İsim boş olamaz',
      });
    }

    const couple = await Couple.findOne({ inviteKey });
    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Davet bulunamadı',
      });
    }

    if (couple.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Bu davet zaten tamamlanmış',
      });
    }

    couple.partnerName = String(partnerName).trim();
    couple.partnerAnswers = partnerAnswers;
    couple.status = 'completed';

    await couple.save();

    return res.status(200).json({
      success: true,
      status: couple.status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Davet tamamlanırken bir hata oluştu.',
    });
  }
};

export const getCoupleResult = async (req, res) => {
  try {
    const { inviteKey } = req.params;
    const couple = await Couple.findOne({ inviteKey }).select('status userAnswers partnerAnswers userName partnerName');

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Kayıt bulunamadı',
      });
    }

    return res.status(200).json({
      success: true,
      userName: couple.userName,
      partnerName: couple.partnerName,
      userAnswers: couple.userAnswers,
      partnerAnswers: couple.partnerAnswers,
      status: couple.status
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Rapor getirilirken bir hata oluştu.',
    });
  }
};