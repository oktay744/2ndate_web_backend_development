import Payment from '../models/Payment.js';

export const createPayment = async (req, res) => {
  try {
    const { email, analysisId } = req.body;

    if (!email || !analysisId) {
      return res.status(400).json({
        success: false,
        message: 'Email ve analysisId gereklidir',
      });
    }

    const payment = await Payment.create({
      email,
      analysisId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      paymentId: payment._id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Ödeme kaydı oluşturulurken bir hata oluştu',
    });
  }
};