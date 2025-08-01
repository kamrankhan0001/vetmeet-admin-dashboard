// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Address = require('../models/Address');

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single order by ID for the authenticated user
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to view this order.' });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { orderItems, shippingAddressId, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided.' });
  }
  if (!shippingAddressId) {
    return res.status(400).json({ message: 'Shipping address is required.' });
  }

  try {
    const shippingAddress = await Address.findOne({ _id: shippingAddressId, userId: req.user.uid });
    if (!shippingAddress) {
      return res.status(404).json({ message: 'Shipping address not found or does not belong to user.' });
    }

    let totalAmount = 0;
    const itemsForOrder = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      itemsForOrder.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        productName: product.name,
        productImage: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null,
      });
      totalAmount += product.price * item.quantity;

      // Decrement stock (consider a transaction for real-world apps)
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId: req.user.uid,
      items: itemsForOrder,
      totalAmount: totalAmount,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        mobileNo: shippingAddress.mobileNo,
        emailId: shippingAddress.emailId,
        houseNo: shippingAddress.houseNo,
        roadName: shippingAddress.roadName,
        landmark: shippingAddress.landmark,
        pincode: shippingAddress.pincode,
        townCity: shippingAddress.townCity,
        state: shippingAddress.state,
      },
      paymentMethod: paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const createdOrder = await newOrder.save();

    res.status(201).json({ message: 'Order created successfully. Proceed to payment.', order: createdOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status (for users to cancel their own orders)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.uid });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to cancel this order.' });
    }

    if (order.status === 'pending' || order.status === 'processing') {
      order.status = 'cancelled';
      await order.save();
      // Optional: Implement stock replenishment logic here if order is cancelled before shipping
      res.json({ message: 'Order cancelled successfully.', order });
    } else {
      res.status(400).json({ message: `Order cannot be cancelled in '${order.status}' status.` });
    }
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  cancelOrder,
};