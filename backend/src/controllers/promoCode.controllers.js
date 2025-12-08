import PromoCode from "../models/promoCode.models.js";
import Cart from "../models/cart.models.js";

export const applyPromo = async (req, res) => {
  try {
    const { code } = req.body;
    

    const promo = await PromoCode.findOne({ code, isActive: true });

    if (!promo) return res.status(404).json({ success: false, message: "Invalid promo code" });
    if (promo.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "Promo code expired" });

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ success: false, message: "Cart is empty" });

    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = (cart.totalPrice * promo.amount) / 100;
    } else {
      discount = promo.amount;
    }

    const finalPrice = Math.max(cart.totalPrice - discount, 0);

    return res.status(200).json({
      success: true,
      message: "Promo applied successfully",
      discount,
      finalPrice,
      promo
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// GET all promo codes
export const getAllPromoCodes = async (req, res) => {
  try {
    const codes = await PromoCode.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, codes });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// CREATE
export const createPromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.create(req.body);
    res.status(201).json({ success: true, promo });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// UPDATE
export const updatePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, promo });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// DELETE
export const deletePromoCode = async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
