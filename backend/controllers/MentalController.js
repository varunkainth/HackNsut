import MentalHealth from "../models/MentalHealth.js";

export const create = async (req, res) => {
  try {
    const { mood, journal } = req.body;
    const userId = req.user;

    const health = await MentalHealth.create({
      mood,
      journal,
      userId,
    });
    return res.status(200).json({
        message: "Mental health journal created successfully",
        data: health
    })
  } catch (err) {
    console.error("Error In Mental Health Controller Create Error", err);
    res.status(500).json({
      message: "Error In Mental Health Controller Create Error",
      error: err.message,
    });
  }
};


