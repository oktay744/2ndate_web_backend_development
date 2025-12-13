import crypto from 'crypto';
import CoupleAnalysis from '../models/CoupleAnalysis.js';
import UserAnalysis from '../models/UserAnalysis.js';

const generateInviteKey = async () => {
  for (let i = 0; i < 10; i++) {
    const key = crypto.randomBytes(8).toString('base64url');
    const exists = await CoupleAnalysis.exists({ inviteKey: key });
    if (!exists) return key;
  }

  return crypto.randomBytes(12).toString('base64url');
};

export const createInvite = async (req, res) => {
  try {
    const userId = req.userData.id;

    const userAnalysis = await UserAnalysis.findOne({ userId });
    if (!userAnalysis) {
      return res.status(400).json({
        success: false,
        message: 'Önce kendi testini tamamlamalısın.',
      });
    }

    const inviteKey = await generateInviteKey();

    const invite = await CoupleAnalysis.create({
      userId,
      inviteKey,
      userAnswers: userAnalysis.answers,
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
    const couple = await CoupleAnalysis.findOne({ inviteKey }).select('status');

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
    const { partnerName, partnerAnswers, coupleResult } = req.body;

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

    const couple = await CoupleAnalysis.findOne({ inviteKey });
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
    if (coupleResult) {
      couple.coupleResult = coupleResult;
    }
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
    const couple = await CoupleAnalysis.findOne({ inviteKey }).select('status coupleResult partnerName');

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Kayıt bulunamadı',
      });
    }

    if (couple.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Rapor henüz hazır değil',
      });
    }

    return res.status(200).json({
      success: true,
      coupleResult: couple.coupleResult,
      partnerName: couple.partnerName
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Rapor getirilirken bir hata oluştu.',
    });
  }
};