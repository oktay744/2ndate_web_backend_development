import Answers from '../models/Answers.js';

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

    await Answers.findOneAndUpdate(
      { userId },
      { answers },
      { upsert: true }
    );

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

    const savedAnswers = await Answers.findOne({ userId });

    if (!savedAnswers) {
      return res.status(404).json({
        success: false,
        message: 'Cevaplar bulunamadı',
      });
    }

    return res.status(200).json({
      success: true,
      answers: savedAnswers.answers
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cevaplar getirilirken bir hata oluştu',
    });
  }
};
