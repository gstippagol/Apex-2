const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        next(err);
    }
};

exports.getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'name email usn').sort('-createdAt');
        res.status(200).json({ success: true, count: feedback.length, data: feedback });
    } catch (err) {
        next(err);
    }
};

exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        await feedback.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
