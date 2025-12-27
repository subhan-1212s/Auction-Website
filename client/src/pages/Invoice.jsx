import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiDownload, FiPrinter, FiArrowLeft, FiCheckCircle, FiPackage, FiInfo } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Invoice() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/api/orders/invoice/${id}`)
        setOrder(res.data.data)
      } catch (err) {
        console.error('Invoice fetch error:', err)
        toast.error('Failed to load invoice details')
      } finally {
        setLoading(false)
      }
    }
    fetchInvoice()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    const input = document.getElementById('invoice-content')
    const toastId = toast.loading('Generating PDF...')
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Invoice_${order._id.slice(-8)}.pdf`)
      toast.dismiss(toastId)
      toast.success('Invoice Downloaded')
    } catch (err) {
      console.error(err)
      toast.dismiss(toastId)
      toast.error('Failed to download PDF')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <FiInfo className="text-gray-300 mb-4" size={64} />
      <h2 className="text-2xl font-black text-gray-900 mb-2">Invoice Not Found</h2>
      <p className="text-gray-500 mb-6">We couldn't locate the details for this order.</p>
      <Link to="/dashboard?tab=orders" className="bg-[#1A1A1A] text-white px-8 py-3 rounded-xl font-bold">Return to Dashboard</Link>
    </div>
  )

  const { product, buyer, seller, amount, status, createdAt, _id } = order

  return (
    <div className="min-h-screen bg-gray-100/50 py-12 px-6">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link to="/dashboard?tab=orders" className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#1A1A1A]">
          <FiArrowLeft /> Back to Orders
        </Link>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-all shadow-sm">
            <FiPrinter /> Print
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
            <FiDownload /> Download
          </button>
        </div>
      </div>

      <div id="invoice-content" className="max-w-4xl mx-auto bg-white p-12 md:p-16 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-gray-100 print:shadow-none print:border-none print:p-0">

        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-12 mb-12 gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                S
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Smart Auction <span className="text-blue-600">.</span></h2>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Invoice Number</p>
            <h1 className="text-xl font-bold text-gray-900 mb-1">#INV-{_id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500 font-medium">{new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl inline-flex items-center gap-2 mb-4">
              <FiCheckCircle size={16} />
              <span className="text-xs font-black uppercase tracking-widest">Payment {status.toUpperCase()}</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900">Tax Invoice 18% GST</p>
              <p className="text-xs text-gray-400 font-medium">Digital Transaction ID: {order.payment?.transactionId || 'STRIPE_SIMULATED'}</p>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Billed To (Buyer)</h3>
            <div className="space-y-2">
              <p className="text-lg font-black text-gray-900">{buyer?.name}</p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {buyer?.address?.street}<br />
                {buyer?.address?.city}, {buyer?.address?.state}<br />
                {buyer?.address?.zipCode}, {buyer?.address?.country}<br />
                <span className="text-gray-400 mt-2 block">Phone: {buyer?.phone}</span>
              </p>
            </div>
          </div>
          <div className="p-8 bg-blue-50/10 rounded-3xl border border-blue-50/50 text-right">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Sold By (Seller)</h3>
            <div className="space-y-2">
              <p className="text-lg font-black text-gray-900">{seller?.name}</p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {seller?.address?.street || 'Not Provided'}<br />
                {seller?.address?.city || 'Default Location'}, {seller?.address?.state || ''}<br />
                {seller?.address?.country || 'India'}<br />
                <span className="text-gray-400 mt-2 block">Contact: {seller?.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <div className="mb-12">
          <div className="grid grid-cols-12 bg-gray-900 text-white rounded-t-2xl px-6 py-4">
            <div className="col-span-12 md:col-span-8 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <FiPackage /> Item Description
            </div>
            <div className="hidden md:block md:col-span-4 text-right text-[10px] font-black uppercase tracking-widest">
              Price (₹)
            </div>
          </div>

          <div className="grid grid-cols-12 px-6 py-8 border-x border-b border-gray-100 rounded-b-2xl">
            <div className="col-span-12 md:col-span-8">
              <h4 className="text-lg font-black text-gray-900 mb-1">{product?.name}</h4>
              <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                <FiInfo size={12} /> Unique Product Identifier: {product?._id}
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 flex md:block justify-between items-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
              <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Subtotal</span>
              <p className="text-xl font-black text-gray-900 text-right">₹{amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end gap-3 px-6">
          <div className="flex justify-between w-64 text-sm text-gray-500 font-medium">
            <span>Platform Service Fee</span>
            <span>₹0.00</span>
          </div>
          <div className="flex justify-between w-64 text-sm text-gray-500 font-medium border-b border-gray-100 pb-3">
            <span>Estimated Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between w-64 py-3">
            <span className="text-lg font-black text-gray-900">Grand Total</span>
            <span className="text-2xl font-black text-blue-600">₹{amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Declaration */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
            <div className="text-gray-400 font-medium leading-relaxed italic">
              "This is a computer-generated invoice and doesn't require a physical signature. The platform merely facilitates the auction; actual delivery and product warranty are the responsibility of the seller listed above."
            </div>
            <div className="flex flex-col items-start md:items-end">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Official Seal</p>
              <div className="w-32 h-32 border-4 border-blue-50/50 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="text-blue-600/10 font-black text-xs scale-150 rotate-12">SMART AUCTION VERIFIED</div>
                <FiCheckCircle className="text-blue-600 text-5xl relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest pb-12 print:hidden">
        Generated by Smart Auction Platform · {new Date().getFullYear()}
      </div>
    </div>
  )
}
