import PricingConfig from "../models/pricingConfig.models.js";

export const getPricingConfig = async (req, res) => {
  try {
    const config = await PricingConfig.findOne();
    return res.status(200).json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatePricingConfig = async (req, res) => {
  try {
    const config = await PricingConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    return res.status(200).json({
      success: true,
      message: "Pricing configuration updated",
      config,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
