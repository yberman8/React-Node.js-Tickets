import mongoose from 'mongoose';

const TempCodeSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
            index: true
        },
        email_code_verify: { type: String, default: "" },
        createdAt: { type: Date, expires: 300, default: Date.now } // Document will expire 5 minutes from 'createdAt'
    },
    { timestamps: true }
);

const TempCode = mongoose.model('TempCode', TempCodeSchema); // Model name changed to 'TempCode'
TempCode.syncIndexes();

export default TempCode;
