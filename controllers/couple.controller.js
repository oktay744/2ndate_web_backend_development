import crypto from 'crypto';
import Couple from '../models/Couple.js';
import Answers from '../models/Answers.js';
import User from '../models/User.js';

const generateInviteKey = async () => {
  for (let i = 0; i < 10; i++) {
    const key = crypto.randomBytes(4).toString('base64url');
    const exists = await Couple.exists({ inviteKey: key });
    if (!exists) return key;
  }

  return crypto.randomBytes(6).toString('base64url');
};

export const createInvite = async (req, res) => {
  try {
    const userId = req.userData.id;

    const record = await Answers.findOne({ userId });
    if (!record) {
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

    const existingInvite = await Couple.findOne({
      firstPersonId: userId,
      status: 'pending',
    });

    if (existingInvite) {
      return res.status(200).json({
        success: true,
        inviteKey: existingInvite.inviteKey,
        status: existingInvite.status
      });
    }

    const inviteKey = await generateInviteKey();

    const invite = await Couple.create({
      firstPersonId: userId,
      secondPersonId: null,
      partnerName: null,
      inviteKey,
      partnerAnswers: null,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      inviteKey,
      status: invite.status
    });
  } catch (err) {
    console.error('CreateInvite error:', err);
    return res.status(500).json({
      success: false,
      message: 'Davet oluşturulurken bir hata oluştu.',
    });
  }
};

export const getInvite = async (req, res) => {
  try {
    const { inviteKey } = req.params;
    const couple = await Couple.findOne({ inviteKey }).select('status firstPersonId');

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Davet bulunamadı',
      });
    }

    return res.status(200).json({
      success: true,
      status: couple.status,
      firstPersonId: couple.firstPersonId || null
    });
  } catch (err) {
    console.error('GetInvite error:', err);
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
    console.error('CompleteInvite error:', err);
    return res.status(500).json({
      success: false,
      message: 'Davet tamamlanırken bir hata oluştu.',
    });
  }
};

export const getCoupleResult = async (req, res) => {
  try {
    const { inviteKey } = req.params;
    const couple = await Couple.findOne({ inviteKey })
      .populate('firstPersonId', 'fullName')
      .populate('secondPersonId', 'fullName');

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Kayıt bulunamadı',
      });
    }

    if (couple.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Partner henüz testi tamamlamadı'
      });
    }

    if (!couple.firstPersonId) {
      return res.status(404).json({
        success: false,
        message: 'Davet sahibi bulunamadı',
      });
    }

    const firstAnswersDoc = await Answers.findOne({ userId: couple.firstPersonId._id });
    if (!firstAnswersDoc) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı cevapları bulunamadı',
      });
    }

    let secondPersonAnswers;
    if (couple.secondPersonId) {
      const secondAnswersDoc = await Answers.findOne({ userId: couple.secondPersonId._id });
      secondPersonAnswers = secondAnswersDoc?.answers || couple.partnerAnswers;
    } else {
      secondPersonAnswers = couple.partnerAnswers;
    }

    return res.status(200).json({
      success: true,
      firstPersonName: couple.firstPersonId.fullName,
      secondPersonName: couple.secondPersonId?.fullName || couple.partnerName,
      firstPersonAnswers: firstAnswersDoc.answers,
      secondPersonAnswers: secondPersonAnswers,
      status: couple.status
    });
  } catch (err) {
    console.error('GetCoupleResult error:', err);
    return res.status(500).json({
      success: false,
      message: 'Analiz getirilirken bir hata oluştu.',
    });
  }
};

export const getMyInvites = async (req, res) => {
  try {
    const userId = req.userData.id;
    const invites = await Couple.find({
      $or: [
        { firstPersonId: userId },
        { secondPersonId: userId }
      ]
    })
      .populate('firstPersonId', 'fullName')
      .populate('secondPersonId', 'fullName')
      .sort({ createdAt: -1 })
      .select('-partnerAnswers');

    return res.status(200).json({
      success: true,
      invites
    });
  } catch (err) {
    console.error('GetMyInvites error:', err);
    return res.status(500).json({
      success: false,
      message: 'Davetler alınırken bir hata oluştu.',
    });
  }
};

export const linkCoupleAccount = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { inviteKey } = req.body;

    if (!inviteKey) {
      return res.status(400).json({
        success: false,
        message: 'Davet anahtarı gerekli',
      });
    }

    const userAnswers = await Answers.findOne({ userId });
    if (!userAnswers) {
      return res.status(400).json({
        success: false,
        message: 'Önce kendi testini tamamlamalısın',
      });
    }

    const couple = await Couple.findOne({
      inviteKey,
      secondPersonId: null
    });

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: 'Bağlanabilecek davet bulunamadı',
      });
    }

    if (couple.firstPersonId.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Kendi davetine bağlanamazsın',
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
      if (couple.partnerName) {
        user.fullName = couple.partnerName;
        await user.save();
      } else {
        return res.status(400).json({
          success: false,
          message: 'İsim bilgini girmelisin',
        });
      }
    }

    couple.secondPersonId = userId;
    couple.status = 'completed';

    await couple.save();

    return res.status(200).json({
      success: true,
      inviteKey: couple.inviteKey
    });
  } catch (err) {
    console.error('LinkCoupleAccount error:', err);
    return res.status(500).json({
      success: false,
      message: 'Hesap bağlanırken bir hata oluştu.',
    });
  }
};