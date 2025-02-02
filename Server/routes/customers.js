// const express = require('express');
// const router = express.Router();
// const Customer = require('../models/Customer');

// // Get all customers
// router.get('/', async (req, res) => {
//     try {
//         const customers = await Customer.find();
//         res.status(200).json(customers);
//     } catch (err) {
//         res.status(500).json({ error: 'Error fetching customers' });
//     }
// });

// // Create new customer
// router.post('/', async (req, res) => {
//     try {
//         const customer = new Customer(req.body);
//         await customer.save();
//         res.status(201).json(customer);
//     } catch (err) {
//         res.status(400).json({ error: 'Error creating customer' });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

// Get all customers (protected)
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

// Add new customer (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;
    
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      notes,
      createdBy: req.user.id
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: 'Error creating customer' });
  }
});

// Update customer (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const { name, email, phone, address, notes } = req.body;
    Object.assign(customer, { name, email, phone, address, notes });

    await customer.save();
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: 'Error updating customer' });
  }
});

// Delete customer (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting customer' });
  }
});

module.exports = router;