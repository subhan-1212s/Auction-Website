import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MockPaymentGateway from '../components/MockPaymentGateway';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowLeft, FiLock, FiShield, FiCreditCard } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const FullScreenSuccess = ({ product, navigate }) => {
  const steps = [
    { title: 'Order Placed', status: 'complete', date: 'Just now' },
    { title: 'Payment Confirmed', status: 'complete', date: 'Just now' },
    { title: 'Packed & Ready', status: 'pending', date: 'Expected tomorrow' },
    { title: 'Delivered', status: 'pending', date: 'Expected in 3-4 days' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto"
    >
      <div className="max-w-4xl w-full my-auto">
        <div className="text-center mb-8 md:mb-12 mt-8 md:mt-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl shadow-emerald-500/20"
          >
            <FiCheck size={32} className="md:w-10 md:h-10" />
          </motion.div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 md:mb-4 tracking-tight uppercase">Payment Successful!</h1>
          <p className="text-gray-500 font-bold text-sm md:text-base max-w-md mx-auto">Your order has been placed. Redirecting to your orders panel soon...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start mb-8 md:mb-0">
          <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 order-2 md:order-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 md:mb-8">Delivery Progress</h3>
            <div className="space-y-6 md:space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200 rounded-full" />
              <div className="absolute left-[11px] top-2 h-1/4 w-0.5 bg-emerald-500 rounded-full" />

              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 md:gap-6 relative z-10 transition-all duration-700">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${step.status === 'complete' ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                    {step.status === 'complete' ? <FiCheck size={12} /> : i + 1}
                  </div>
                  <div>
                    <p className={`font-black text-xs md:text-sm uppercase tracking-wider ${step.status === 'complete' ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
              <div className="flex gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                  <img src={product.images[0]} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 mb-1 leading-tight truncate">{product.name}</h4>
                  <p className="text-[#D4AF37] font-black text-lg md:text-xl">₹{product.currentBid.toLocaleString()}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-2 tracking-widest truncate">ORDER: SM-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-dashed border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                <button onClick={() => navigate('/dashboard?tab=orders')} className="text-gray-900 font-black text-[10px] uppercase tracking-widest hover:underline text-center sm:text-left">View in Dashboard</button>
                <button onClick={() => navigate('/')} className="text-gray-900 font-black text-[10px] uppercase tracking-widest hover:underline text-center sm:text-right">Continue Shopping</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [showMockGateway, setShowMockGateway] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState(null);
  const [currentStep, setCurrentStep] = useState(2); // Start at Address (Login is 1)
  const [isSuccess, setIsSuccess] = useState(false);
  const [payMethod, setPayMethod] = useState('paytm');

  const [address, setAddress] = useState({
    name: '',
    mobile: '',
    pincode: '',
    locality: '',
    fullAddress: '',
    city: '',
    state: '',
    type: 'home'
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchUserAddresses();
  }, [id]);

  const fetchUserAddresses = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data.success) {
        setSavedAddresses(data.data.addresses || []);
        const defaultAddr = data.data.addresses?.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          setAddress({
            name: defaultAddr.name,
            mobile: defaultAddr.mobile,
            pincode: defaultAddr.zipCode,
            locality: defaultAddr.locality,
            fullAddress: defaultAddr.street,
            city: defaultAddr.city,
            state: defaultAddr.state,
            type: defaultAddr.type
          });
          setCurrentStep(3); // Auto-skip if address exists
        } else if (data.data.addresses?.length > 0) {
          setSelectedAddressId(data.data.addresses[0]._id);
        } else {
          setShowAddressForm(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses');
    }
  };

  const fetchProduct = async () => {
    try {
      const prodRes = await axios.get(`/api/products/${id}`);
      setProduct(prodRes.data.data);
    } catch (error) {
      toast.error('Failed to load item');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');

    toast.loading('Fetching your location...', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        // Using a free reverse geocoding API (BigDataCloud or similar)
        const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = res.data;

        setAddress(prev => ({
          ...prev,
          city: data.city || data.principalSubdivision,
          state: data.principalSubdivision,
          pincode: data.postcode || '',
          locality: data.locality || ''
        }));
        toast.success('Location detected!', { id: 'geo' });
      } catch (err) {
        toast.error('Could not determine exact address', { id: 'geo' });
      }
    }, () => {
      toast.error('Location access denied', { id: 'geo' });
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (address.mobile.length !== 10) return toast.error('Enter valid 10-digit mobile');

    try {
      const { data } = await axios.post('/api/auth/addresses', {
        name: address.name,
        mobile: address.mobile,
        zipCode: address.pincode,
        locality: address.locality,
        street: address.fullAddress,
        city: address.city,
        state: address.state,
        type: address.type
      });

      setSavedAddresses(data.data);
      setSelectedAddressId(data.data[data.data.length - 1]._id);
      setShowAddressForm(false);
      toast.success('Address Saved Successfully');
      setCurrentStep(3);
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const selectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setAddress({
      name: addr.name,
      mobile: addr.mobile,
      pincode: addr.zipCode,
      locality: addr.locality,
      fullAddress: addr.street,
      city: addr.city,
      state: addr.state,
      type: addr.type
    });
  };

  const handleMockSuccess = async () => {
    setShowMockGateway(false);
    const toastId = toast.loading('Verifying payment...');
    try {
      const confirmRes = await axios.post('/api/payments/confirm', {
        paymentIntentId: mockPaymentData.orderId,
        productId: product._id,
        address: {
          street: address.fullAddress,
          city: address.city,
          state: address.state,
          zipCode: address.pincode,
          country: 'India'
        }
      });

      if (confirmRes.data.success) {
        toast.dismiss(toastId);
        toast.success('Payment Successful! 🎉');
        window.dispatchEvent(new Event('cartUpdated'));
        setIsSuccess(true);
      } else {
        toast.dismiss(toastId);
        toast.error('Payment confirmation failed.');
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error('Confirmation error. Contact support.');
    }
  };

  const handlePayment = async () => {
    if (!payMethod) {
      return toast.error('Please select a payment method');
    }

    const paymentMethodName = payMethod === 'paytm' ? 'Paytm' :
      payMethod === 'card' ? 'Card' :
        payMethod === 'netbanking' ? 'Net Banking' : 'COD';

    const loader = toast.loading(`Initiating ${paymentMethodName} Payment...`);

    try {
      if (payMethod === 'paytm') {
        // Paytm payment flow
        const { data } = await axios.post('/api/payments/paytm/initiate', {
          productId: product._id,
          address: {
            street: address.fullAddress,
            city: address.city,
            state: address.state,
            zipCode: address.pincode,
            country: 'India'
          }
        });

        if (data.isMock) {
          // Open Mock Gateway
          toast.dismiss(loader);
          setLoading(false);
          setMockPaymentData({ orderId: data.orderId });
          setShowMockGateway(true);
        } else {
          // Real Paytm Flow: Redirect to Payment Gateway
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.paytmUrl;

          const midInput = document.createElement('input');
          midInput.type = 'hidden';
          midInput.name = 'mid';
          midInput.value = data.mid;
          form.appendChild(midInput);

          const orderIdInput = document.createElement('input');
          orderIdInput.type = 'hidden';
          orderIdInput.name = 'orderId';
          orderIdInput.value = data.orderId;
          form.appendChild(orderIdInput);

          const txnTokenInput = document.createElement('input');
          txnTokenInput.type = 'hidden';
          txnTokenInput.name = 'txnToken';
          txnTokenInput.value = data.txnToken;
          form.appendChild(txnTokenInput);

          document.body.appendChild(form);
          form.submit();

          toast.success('Redirecting to Paytm...', { id: loader });
        }
      } else if (payMethod === 'card' || payMethod === 'netbanking') {
        // Show Mock UI for Card/Netbanking
        toast.dismiss(loader);
        setLoading(false);
        setMockPaymentData({ orderId: `demo_${payMethod}_${Date.now()}` });
        setShowMockGateway(true);
      } else if (payMethod === 'cod') {
        // Existing COD logic...
        const loader = toast.loading('Processing COD Order...');
        setTimeout(async () => {
          // ... existing confirm logic ...
          try {
            const confirmRes = await axios.post('/api/payments/confirm', {
              paymentIntentId: `cod_${Date.now()}`,
              productId: product._id,
              address: {
                street: address.fullAddress,
                city: address.city,
                state: address.state,
                zipCode: address.pincode,
                country: 'India'
              }
            });
            // ...
            if (confirmRes.data.success) {
              toast.dismiss(loader);
              toast.success('Order Placed! 🎉');
              window.dispatchEvent(new Event('cartUpdated'));
              setIsSuccess(true);
            }
          } catch (e) {
            toast.dismiss(loader);
            toast.error('Failed to place order');
          }
        }, 1500);
      } else {
        toast.error('Please select a payment method');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.response?.data?.message || 'Payment initiation failed. Please try again.', { id: loader });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans selection:bg-gray-200">
      {/* Premium Header */}
      <div className="bg-[#0f0f0f] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1240px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-luxury font-black text-2xl tracking-tighter cursor-pointer flex items-center gap-1" onClick={() => navigate('/')}>
              SMART<span className="text-[#D4AF37] opacity-100 font-normal">AUCTION</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest opacity-90">
            <FiShield size={16} className="text-[#D4AF37]" /> SECURE ELITE CHECKOUT
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

        {/* Left Column: Steps */}
        <div className="space-y-4">

          {/* Step 1: LOGIN */}
          <div className="bg-white rounded-sm shadow-sm flex flex-col overflow-hidden border border-gray-100">
            <div className="p-4 py-3 bg-white flex items-center gap-4 border-b border-gray-50">
              <span className="bg-gray-100 text-gray-900 w-5 h-5 flex items-center justify-center rounded-sm text-[11px] font-black">1</span>
              <span className="font-black uppercase text-gray-400 text-[12px] tracking-[0.1em]">Login</span>
              <FiCheck className="text-gray-900 ml-auto" />
            </div>
            <div className="p-5 px-12">
              <div className="flex justify-between items-center group">
                <div>
                  <p className="text-[14px] font-black text-gray-900">{user?.name || 'Guest User'} <span className="text-gray-400 font-medium ml-2">{user?.phone || user?.email || ''}</span></p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">Logged in via encrypted tunnel</p>
                </div>
                <button onClick={() => navigate('/login')} className="text-blue-600 font-black text-[11px] uppercase tracking-wider hover:bg-blue-50 px-3 py-1.5 rounded-sm transition-all border border-transparent hover:border-blue-100">Change</button>
              </div>
            </div>
          </div>

          {/* Step 2: DELIVERY ADDRESS */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100">
            <div className={`p-4 py-3 flex items-center gap-4 ${currentStep === 2 ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <span className={`${currentStep === 2 ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-900'} w-5 h-5 flex items-center justify-center rounded-sm text-[11px] font-black`}>2</span>
              <span className={`font-black uppercase text-[12px] tracking-[0.1em] ${currentStep === 2 ? 'text-white' : 'text-gray-400'}`}>Delivery Address</span>
              {currentStep > 2 && <FiCheck className="text-gray-900 ml-auto" />}
            </div>

            {currentStep === 2 ? (
              <div className="p-6 px-12 bg-white">

                {/* Saved Addresses List */}
                {!showAddressForm && savedAddresses.length > 0 && (
                  <div className="space-y-4 mb-8">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Saved Addresses</p>
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => selectAddress(addr)}
                        className={`p-5 border rounded-sm cursor-pointer transition-all relative group shadow-sm hover:shadow-md ${selectedAddressId === addr._id ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        <div className="flex items-start gap-4">
                          <input type="radio" checked={selectedAddressId === addr._id} readOnly className="w-4 h-4 mt-1 accent-gray-900" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-black text-[15px] text-gray-900">{addr.name}</span>
                              <span className="bg-gray-100 text-[9px] px-2 py-0.5 rounded-sm font-black uppercase text-gray-500 tracking-wider font-sans">{addr.type}</span>
                              <span className="font-black text-[14px] ml-auto text-gray-400">{addr.mobile}</span>
                            </div>
                            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                              {addr.street}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.zipCode}</span>
                            </p>

                            {selectedAddressId === addr._id && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setCurrentStep(3)}
                                className="mt-5 bg-gray-900 text-white font-black text-[12px] py-3.5 px-10 shadow-lg hover:bg-black transition-all rounded-sm uppercase tracking-[0.05em]"
                              >
                                Deliver Here
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-900 font-black text-[12px] uppercase tracking-wider hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      + Add a New Address
                    </button>
                  </div>
                )}

                {/* Add New Address Form */}
                {(showAddressForm || savedAddresses.length === 0) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                      <h3 className="font-black text-gray-900 uppercase text-[15px] tracking-tight">Add New Shipping Address</h3>
                      <button onClick={handleUseLocation} className="text-gray-900 font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition-all border border-gray-200">
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" /> Use Current Location
                      </button>
                    </div>

                    <form onSubmit={handleAddressSubmit} className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient Name</label>
                          <input type="text" placeholder="Full Name" required className="fk-input luxury-input" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">10-Digit Mobile Number</label>
                          <input type="text" placeholder="+91" required className="fk-input luxury-input" value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pincode / Zip</label>
                          <input type="text" placeholder="6-digit Pincode" required className="fk-input luxury-input" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Locality / Landmark</label>
                          <input type="text" placeholder="e.g. Near Elite Plaza" required className="fk-input luxury-input" value={address.locality} onChange={(e) => setAddress({ ...address, locality: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address (Area and Street)</label>
                        <textarea placeholder="House No, Building, Street, Area" required className="fk-input luxury-input h-24 resize-none pt-3" value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City / District</label>
                          <input type="text" placeholder="City" required className="fk-input luxury-input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">State / Province</label>
                          <select className="fk-input luxury-input" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                            <option value="">-- Select State --</option>
                            {['Andhra Pradesh', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Rajasthan'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="py-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Address Tag</p>
                        <div className="flex gap-6">
                          {['home', 'work'].map(t => (
                            <label key={t} className="flex items-center gap-3 text-[14px] font-black cursor-pointer group">
                              <input type="radio" checked={address.type === t} onChange={() => setAddress({ ...address, type: t })} className="w-5 h-5 accent-gray-900 transition-transform group-hover:scale-110" />
                              <span className="uppercase tracking-wider text-gray-700">{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button type="submit" className="bg-gray-900 text-white font-black text-[12px] py-4 px-12 shadow-xl hover:bg-black transition-all rounded-sm uppercase tracking-widest flex-1 md:flex-none">Save and Deliver Here</button>
                        {savedAddresses.length > 0 && (
                          <button type="button" onClick={() => setShowAddressForm(false)} className="px-8 border border-gray-200 text-gray-400 font-extrabold text-[11px] uppercase tracking-wider hover:bg-gray-50 rounded-sm">Cancel</button>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            ) : (
              currentStep > 2 && (
                <div className="p-5 px-12 flex justify-between items-start bg-white border-t border-gray-50">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-black text-[15px] text-gray-900">{address.name}</span>
                      <span className="bg-gray-100 text-gray-900 text-[9px] px-2 py-0.5 rounded-sm font-black uppercase tracking-wider">{address.type}</span>
                      <span className="font-black text-[14px] ml-4 text-gray-400">{address.mobile}</span>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-snug max-w-md font-medium">{address.fullAddress}, {address.locality}, {address.city}, {address.state} - <span className="font-black text-gray-900">{address.pincode}</span></p>
                  </div>
                  <button onClick={() => { setCurrentStep(2); setShowAddressForm(true); }} className="text-gray-900 font-black text-[11px] uppercase border border-gray-200 px-5 py-2.5 hover:bg-gray-50 rounded-sm transition-all tracking-wider">Change</button>
                </div>
              )
            )}
          </div>

          {/* Step 3: ORDER SUMMARY */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className={`p-4 py-3 flex items-center gap-4 ${currentStep === 3 ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <span className={`${currentStep === 3 ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-900'} w-5 h-5 flex items-center justify-center rounded-sm text-[11px] font-black`}>3</span>
              <span className={`font-black uppercase text-[13px] tracking-wide ${currentStep === 3 ? 'text-white' : 'text-gray-500'}`}>Order Summary</span>
              {currentStep > 3 && <FiCheck className="text-gray-900 ml-auto" />}
            </div>
            {currentStep === 3 && (
              <div className="p-4 px-12">
                <div className="flex gap-6 py-4">
                  <div className="w-28 h-28 bg-gray-50 border p-2 rounded-sm overflow-hidden">
                    <img src={product.images[0]} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-[16px] font-bold text-gray-900 leading-tight">{product.name}</h4>
                    <p className="text-[12px] text-gray-400 font-bold uppercase">Seller: Smart Retailer</p>
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xl font-black text-gray-900 leading-none">₹{product.currentBid.toLocaleString()}</span>
                      <span className="text-green-600 text-[12px] font-black uppercase tracking-wider">Elite Item Original</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center bg-gray-50 -mx-12 px-12 py-3 border-t">
                  <p className="text-[12px] text-gray-500 font-bold">Order confirmation email will be sent to <span className="font-black text-gray-900">{user?.email || 'your email'}</span></p>
                  <button onClick={() => setCurrentStep(4)} className="bg-gray-900 text-white font-black text-[13px] py-4 px-12 shadow-md hover:bg-black transition-all rounded-sm uppercase">Continue</button>
                </div>
              </div>
            )}
            {currentStep > 3 && (
              <div className="p-2 px-12 text-[13px] font-bold text-gray-500 flex items-center gap-2">
                1 Item <span className="w-1 h-1 bg-gray-300 rounded-full" /> Total Order Value: ₹{product.currentBid.toLocaleString()}
              </div>
            )}
          </div>

          {/* Step 4: PAYMENT OPTIONS */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className={`p-4 py-3 flex items-center gap-4 ${currentStep === 4 ? 'bg-gray-900 text-white' : 'bg-white'}`}>
              <span className={`${currentStep === 4 ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-900'} w-5 h-5 flex items-center justify-center rounded-sm text-[11px] font-black`}>4</span>
              <span className={`font-black uppercase text-[13px] tracking-wide ${currentStep === 4 ? 'text-white' : 'text-gray-500'}`}>Payment Options</span>
            </div>
            {currentStep === 4 && (
              <div className="p-4 px-12 space-y-4">

                {/* Real Paytm Integration */}
                <div
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${payMethod === 'paytm' ? 'bg-blue-50/50 border-blue-200' : 'border-gray-100'}`}
                  onClick={() => setPayMethod('paytm')}
                >
                  <input type="radio" checked={payMethod === 'paytm'} readOnly className="w-4 h-4 accent-blue-600" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png" className="h-5" alt="" />
                  <div className="flex-1">
                    <p className="text-[14px] font-bold">Paytm Wallet / UPI / Postpaid</p>
                  </div>
                </div>

                {/* All Payment Options - Enabled */}
                <div
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${payMethod === 'card' ? 'bg-blue-50/50 border-blue-200' : 'border-gray-100'}`}
                  onClick={() => setPayMethod('card')}
                >
                  <input type="radio" checked={payMethod === 'card'} readOnly className="w-4 h-4 accent-blue-600" />
                  <FiCreditCard className="text-gray-700" size={20} />
                  <div className="flex-1">
                    <p className="text-[14px] font-bold">Credit / Debit / ATM Card</p>
                    <p className="text-[11px] text-gray-500">Visa, Mastercard, RuPay & more</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${payMethod === 'netbanking' ? 'bg-blue-50/50 border-blue-200' : 'border-gray-100'}`}
                  onClick={() => setPayMethod('netbanking')}
                >
                  <input type="radio" checked={payMethod === 'netbanking'} readOnly className="w-4 h-4 accent-blue-600" />
                  <div className="flex-1">
                    <span className="font-black text-gray-900 text-[14px]">Net Banking</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">All major banks supported</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${payMethod === 'cod' ? 'bg-blue-50/50 border-blue-200' : 'border-gray-100'}`}
                  onClick={() => setPayMethod('cod')}
                >
                  <input type="radio" checked={payMethod === 'cod'} readOnly className="w-4 h-4 accent-blue-600" />
                  <div className="flex-1">
                    <span className="font-black text-gray-900 text-[14px]">Cash on Delivery</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">Pay when you receive</p>
                  </div>
                </div>

                {(payMethod === 'paytm' || payMethod === 'card' || payMethod === 'netbanking' || payMethod === 'cod') && (
                  <div className="pt-4 border-t border-dashed mt-4">
                    <button onClick={handlePayment} className="bg-[#D4AF37] text-white font-black text-[14px] py-4 px-12 shadow-xl hover:bg-[#C5A028] transition-all rounded-sm uppercase w-full flex items-center justify-center gap-3">
                      <FiLock /> Confirm and Pay ₹{product.currentBid.toLocaleString()}
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

        {/* Right Column: Price Details */}
        <div className="space-y-4 relative z-0">
          <div className="bg-white rounded-sm shadow-sm sticky top-20 z-10">
            <div className="p-4 py-3 border-b border-gray-100">
              <h3 className="text-gray-400 font-black uppercase text-[12px] tracking-widest">Price Details</h3>
            </div>
            <div className="p-4 space-y-5 px-6">
              <div className="flex justify-between text-[14px] font-medium text-gray-900">
                <span>Price (1 item)</span>
                <span className="font-bold">₹{product.currentBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px] font-medium text-gray-900">
                <span>Discount</span>
                <span className="text-green-600 font-bold">- ₹0</span>
              </div>
              <div className="flex justify-between text-[14px] font-medium text-gray-900">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-[14px] font-medium text-gray-900">
                <span>Secured Packaging Fee</span>
                <span>₹0</span>
              </div>
              <div className="pt-5 border-t border-dashed flex justify-between text-[18px] font-black text-gray-900 tracking-tight">
                <span>Total Amount</span>
                <span>₹{product.currentBid.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-50 text-green-600 font-black text-[12px] uppercase tracking-wide px-6">
              You will save ₹0 on this order
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 text-gray-400 select-none">
            <FiShield size={40} className="mb-auto opacity-50" />
            <p className="text-[11px] font-bold leading-relaxed">Safe and Secure Payments. 100% Authentic products. Smart Auction Guarantee included.</p>
          </div>
        </div>

      </div>
      {isSuccess && <FullScreenSuccess product={product} navigate={navigate} />}

      <MockPaymentGateway
        isOpen={showMockGateway}
        onClose={() => setShowMockGateway(false)}
        onSuccess={handleMockSuccess}
        method={payMethod}
        amount={product?.currentBid || 0}
      />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Inter:wght@400;500;600;700;800;900&display=swap');

        .font-luxury { font-family: 'Playfair Display', serif; }
        
        .fk-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          background: #fff;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .luxury-input:focus {
          border-color: #2874F0;
          box-shadow: 0 0 0 4px rgba(40, 116, 240, 0.05);
          background: #fff;
          transform: translateY(-1px);
        }

        .fk-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        select.fk-input {
           appearance: none;
           background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='C19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
           background-repeat: no-repeat;
           background-position: right 12px center;
           background-size: 16px;
        }

        .luxury-shadow {
           box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
        }

        input[type="radio"] {
           outline: none;
        }
      `}</style>
    </div>
  );
}
