import Profile from '../models/Profile.js';

export const saveAnalysis = async (req, res) => {
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

    let analysis;
    if (existing) {
      existing.answers = answers;
      analysis = await existing.save();
    } else {
      analysis = await Profile.create({
        userId,
        answers,
      });
    }

    return res.status(200).json({
      success: true,
      analysisId: analysis._id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cevaplarınız kaydedilirken hata oluştu',
    });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const userId = req.userData.id;

    const analysis = await Profile.findOne({ userId });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analiz kaydı bulunamadı',
      });
    }

    return res.status(200).json({
      success: true,
      analysis: {
        answers: analysis.answers,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Analiz getirilirken bir hata oluştu',
    });
  }
};
