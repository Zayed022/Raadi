import mongoose from "mongoose";

const PricingConfigSchema = new mongoose.Schema({
  taxPercent: { type: Number, default: 0 }, 
  shippingCharge: { type: Number, default: 0 },
  freeShippingMinAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("PricingConfig", PricingConfigSchema);
