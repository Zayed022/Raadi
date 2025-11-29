import Cart from "../models/cart.models.js";
import Product from "../models/product.models.js";

// ===========================
// Add to Cart
// ===========================
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity, price: product.price }],
        totalItems: 1,
        totalPrice: product.price * quantity
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists – update quantity
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.price * cart.items[itemIndex].quantity;
      } else {
        // Product does not exist – push new item
        cart.items.push({ product: productId, quantity, price: product.price * quantity });
      }

      cart.totalItems = cart.items.length;
      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Added to cart", cart });

  } catch (error) {
    console.error("AddToCart Error:", error);
    return res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ===========================
// Get User Cart
// ===========================
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart)
      return res.status(200).json({ success: true, message: "Cart is empty", cart: [] });

    return res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("GetCart Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Remove Item from Cart
// ===========================
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    cart.totalItems = cart.items.length;
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed", cart });

  } catch (error) {
    console.error("RemoveFromCart Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Update Quantity (Increment/Decrement)
// ===========================
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = quantity * cart.items[itemIndex].product.price;

    cart.totalItems = cart.items.length;
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

    await cart.save();

    return res.status(200).json({ success: true, message: "Quantity updated", cart });

  } catch (error) {
    console.error("UpdateQuantity Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ===========================
// Clear Cart
// ===========================
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    return res.status(200).json({ success: true, message: "Cart cleared" });

  } catch (error) {
    console.error("ClearCart Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
