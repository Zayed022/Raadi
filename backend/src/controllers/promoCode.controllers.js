import PromoCode from "../models/promoCode.models.js";
import Cart from "../models/cart.models.js";

export const applyPromo = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

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
