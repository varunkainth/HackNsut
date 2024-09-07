import CryptoService from "../utils/Encryption.js";
import mongoose from "mongoose";

const crypto = new CryptoService(process.env.CRYPTO_ENCRYPTION_KEY);

const MentalHealthLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mood: { type: String, required: true },
    journal: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

MentalHealthLogSchema.pre("save", async function (next) {
  const document = this;

  if (document.isModified("journal")) {
    try {
      document.journal = crypto.encrypt(document.journal);
    } catch (err) {
      console.error("Encryption failed for journal:", err.message);
      return next(err);
    }
  }

  if (document.isModified("mood")) {
    try {
      document.mood = crypto.encrypt(document.mood);
    } catch (err) {
      console.error("Encryption failed for mood:", err.message);
      return next(err);
    }
  }

  next();
});

MentalHealthLogSchema.methods.decryptData = async function () {
  try {
    // Decrypt the mood and journal fields
    const decryptedMood = await crypto.decrypt(this.mood);
    const decryptedJournal = await crypto.decrypt(this.journal);

    // Return the decrypted data
    return { mood: decryptedMood, journal: decryptedJournal };
  } catch (err) {
    console.error("Decryption failed:", err.message);
    throw err;
  }
};

const MentalHealth = mongoose.model("MentalHealth", MentalHealthLogSchema);
export default MentalHealth;
