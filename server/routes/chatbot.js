const express = require('express')
const router = express.Router()

// Predefined chatbot responses
const responses = {
  'how to place a bid': 'To place a bid, browse auctions, select a product, enter your bid amount (must be higher than current bid + minimum increment), and click "Place Bid".',
  'how to become a seller': 'To become a seller, register an account, then request seller approval from your dashboard. An admin will review your request.',
  'what is minimum bid increment': 'The minimum bid increment is set by the seller. You must bid at least that amount higher than the current highest bid.',
  'how to upload products': 'As a seller, go to "Create Auction", fill in product details, upload images, set starting price and duration, then submit.',
  'what payment methods': 'We accept credit cards, debit cards, and PayPal. Payment is processed securely after auction ends.',
  'how to contact support': 'You can contact support through the chatbot or email support@smartauction.com.',
  'auction rules': 'Auctions end automatically at the set time. Highest bidder wins. All sales are final.',
  'refund policy': 'Refunds are not available for auction purchases. Please bid carefully.',
  'shipping': 'Shipping arrangements are made directly between buyer and seller after payment.',
  'fees': 'There are no bidding fees. Sellers pay a small listing fee after successful sale.'
}

// Chatbot endpoint
router.post('/', (req, res) => {
  const { message } = req.body
  const lowerMessage = message.toLowerCase()

  // Find matching response
  let response = 'I\'m sorry, I don\'t understand that question. Try asking about bidding, selling, or payments.'

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      response = value
      break
    }
  }

  res.json({ response })
})

module.exports = router
