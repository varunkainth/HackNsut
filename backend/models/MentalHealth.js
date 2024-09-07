const mongoose = require('mongoose');

const MentalHealthLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    mood: { type: String, required: true },
    journal: { type: String, required: true },
},{
    timestamps: true
});

module.exports = mongoose.model('MentalHealthLog', MentalHealthLogSchema);
