import React from 'react'

export default function AuctionCard({item}){
  return (
    <div className="bg-gradient-neon-mix p-4 rounded-2xl shadow-lg text-white">
      <div className="flex items-center gap-4">
        <img src={item.image || 'https://via.placeholder.com/120'} alt={item.title} className="w-28 h-20 rounded-md object-cover" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm opacity-80">{item.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm">Highest Bid: <span className="font-bold">₹{item.highestBid}</span></div>
            <div className="text-xs bg-white/10 px-2 py-1 rounded-md">Ends in: {item.endsIn}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
