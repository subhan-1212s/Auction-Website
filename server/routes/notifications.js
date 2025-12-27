const express = require('express')
const { auth } = require('../middleware/auth')
const Notification = require('../models/Notification')

const router = express.Router()

// Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ message: 'Notification not found' })
    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!notification) return res.status(404).json({ message: 'Notification not found' })
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
