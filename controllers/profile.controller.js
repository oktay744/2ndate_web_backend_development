import Profile from '../models/Profile.js';

export const saveAnswers = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli cevaplar gereklidir',
      });
    }

    const existing = await Profile.findOne({ userId });

    let profile;
    if (existing) {
      existing.answers = answers;
      profile = await existing.save();
    } else {
      profile = await Profile.create({
        userId,
        answers,
      });
    }

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cevaplarınız kaydedilirken hata oluştu',
    });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const userId = req.userData.id;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profil bulunamadı',
      });
    }

    return res.status(200).json({
      success: true,
      answers: profile.answers
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cevaplar getirilirken bir hata oluştu',
    });
  }
};