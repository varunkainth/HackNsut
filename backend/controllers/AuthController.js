export const Register = async (req, res) => {
  try {
    
  } catch (err) {
    console.error("Register Auth Controller Error", err);
    return res.status(500).json({ message: err.message });
  }
};
