import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageSquare, FiX, FiSend, FiUser, FiHexagon, FiRefreshCw } from 'react-icons/fi'

// --- 1. LOGIC ENGINE ---
const generateAIResponse = (input) => {
    const clean = input.toLowerCase().trim()

    // Greetings
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'start']
    if (greetings.some(g => clean === g || clean.startsWith(g + ' '))) {
        return "Hello! Welcome to Smart Auction. 👋\nI'm here to help you. You can ask me about:\n• Bidding strategies\n• Selling items\n• Payment methods\n• Account support\n\nHow can I assist you today?"
    }

    // Core Knowledge
    if (clean.includes('account') || clean.includes('support') || clean.includes('password') || clean.includes('login')) {
        return "Account Support: \n• To reset password: Go to Login > Forgot Password.\n• To update profile: Go to Dashboard > Settings.\n• For account deletion: Contact admin@smartauction.com."
    }

    if (clean.includes('bid') || clean.includes('price') || clean.includes('cost')) return "To place a bid: \n1. Go to any Auction page.\n2. Enter an amount higher than the 'Current Bid'.\n3. Confirm.\n\nTip: Bidding in the final seconds (Sniping) is a popular way to win!"
    if (clean.includes('sell') || clean.includes('seller') || clean.includes('vendor')) return "Want to sell? \n1. Go to your Dashboard.\n2. Request 'Seller Access'.\n3. Once approved, you can upload products instantly.\n\nWe verify all sellers to keep the marketplace safe."
    if (clean.includes('fee') || clean.includes('charge') || clean.includes('commission')) return "Good news! We charge 0% fees for buyers.\n\nFor sellers, there is a flat 5% success fee only when your item sells. Listing is free."
    if (clean.includes('pay') || clean.includes('card') || clean.includes('upi') || clean.includes('wallet')) return "We accept Visa, Mastercard, and UPI. All payments are held securely in escrow until the seller ships your item."
    if (clean.includes('ship') || clean.includes('track') || clean.includes('order')) return "Shipping is managed by individual sellers. Once you pay, they are required to share a Tracking ID within 48 hours."
    if (clean.includes('refund') || clean.includes('return') || clean.includes('damage')) return "Our Refund Policy: \nIf an item arrives damaged or not as described, you can request a full refund within 3 days of delivery. We hold the funds until you are satisfied."
    if (clean.includes('register') || clean.includes('signup') || clean.includes('create account')) return "To Register: Click the 'Sign Up' button in the top right. You'll need an email and password. It takes less than a minute!"
    if (clean.includes('trend') || clean.includes('popular') || clean.includes('hot')) return "Trending now: Vintage Electronics and Rare Coins are seeing high activity. Check the 'Home' page for the 'Trending Auctions' section."

    // Conversational
    if (clean.includes('yes') || clean.includes('sure') || clean.includes('ok')) return "Great! Let me know if you need more details on that."
    if (clean.includes('no') || clean.includes('nope')) return "Understood. Is there anything else I can help you with?"
    if (clean.includes('thank') || clean.includes('thx')) return "You're very welcome! Happy bidding! 🔨"

    // Fallback
    return `I received your message: "${clean.substring(0, 20)}...".\n\nI can best help with:\n1. Bidding ("How to bid?")\n2. Selling ("How to list?")\n3. Payments ("What cards accepted?")\n4. Support ("Account support")\n\nPlease try one of these topics!`
}

// --- 2. STYLES (Styles Injected via Style Tag) ---
const styles = `
.chatbot-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #f3f4f6;
}
.chatbot-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.chatbot-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}
.chatbot-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 4px;
  border: 2px solid #f3f4f6;
}
.chatbot-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #374151;
}
`

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I am your Smart Auction Assistant. 🤖\nAsk me about Bidding, Selling, or Payments. I'm here to help!",
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef(null)
    const containerRef = useRef(null) // Ref for the main container

    // Click Outside logic
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping, isOpen])

    const handleSend = () => {
        if (!input.trim()) return

        const userText = input
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: userText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
        setInput('')
        setIsTyping(true)

        setTimeout(() => {
            const reply = generateAIResponse(userText)
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: reply,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
            setIsTyping(false)
        }, 1200)
    }

    return (
        <div
            ref={containerRef}
            className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans"
            style={{ zIndex: 9999 }}
        >
            <style>{styles}</style>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, originY: 1, originX: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        // ORIGINAL ALIGNMENT RECREATED
                        // Floating card above the button (mb-4)
                        className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[380px] h-[500px] max-h-[75vh] mb-4 overflow-hidden border border-gray-200 flex flex-col"
                    >
                        {/* 1. HEADER - PROFESSIONAL BLUE */}
                        <div className="bg-blue-600 p-4 flex items-center justify-between shrink-0 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <FiHexagon className="text-white text-lg" />
                                </div>
                                <div className="text-white">
                                    <h3 className="font-bold text-base leading-tight">Smart Assistant</h3>
                                    <p className="text-[10px] text-blue-100 opacity-90">Online • Replies instantly</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setMessages([])}
                                    className="p-1.5 text-white/80 hover:bg-white/10 rounded-full transition"
                                    title="Start Fresh"
                                >
                                    <FiRefreshCw size={14} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 text-white/80 hover:bg-white/10 rounded-full transition"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        </div>

                        {/* 2. MESSAGES - CLEAN & SCROLLABLE */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-scroll p-4 space-y-4 bg-gray-50 chatbot-scrollbar min-h-0"
                            style={{ overscrollBehavior: 'contain' }}
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* Bot Avatar */}
                                    {msg.sender === 'bot' && (
                                        <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm mt-1">
                                            <FiHexagon className="text-white text-xs" />
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-sm'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                            }`}>
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 px-1 block text-right">
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3 justify-start">
                                    <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm mt-1">
                                        <FiHexagon className="text-white text-xs" />
                                    </div>
                                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. FOOTER - FLEXBOX LAYOUT (Preserved Safe Alignment) */}
                        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Message..."
                                className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-500 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="shrink-0 w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md"
                            >
                                <FiSend size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOGGLE BUTTON (Always Visible in this Alignment) */}
            <motion.button
                layout
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-colors z-[9999]"
            >
                {isOpen ? <FiX size={28} /> : <FiMessageSquare size={28} />}
            </motion.button>
        </div>
    )
}
