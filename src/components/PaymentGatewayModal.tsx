import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building2, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentGatewayModalProps {
    amount: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (method: string) => void;
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ amount, isOpen, onClose, onSuccess }) => {
    const [method, setMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [bank, setBank] = useState('');

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        
        await new Promise(resolve => setTimeout(resolve, 2000));

        setProcessing(false);
        setSuccess(true);

        
        setTimeout(() => {
            onSuccess(method);
            setSuccess(false); 
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-background w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border"
            >
                {}
                <div className="bg-primary/5 p-4 border-b border-border flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                            Secure Payment
                        </h3>
                        <p className="text-sm text-muted-foreground">ElectroCare Payment Gateway</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                {}
                <div className="p-6 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 text-center border-b border-border">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Total Payable</p>
                    <h2 className="text-3xl font-bold text-foreground">₹{amount}</h2>
                </div>

                {}
                <div className="flex p-2 gap-2 border-b border-border bg-muted/20">
                    <button
                        onClick={() => setMethod('UPI')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex flex-col items-center gap-1",
                            method === 'UPI' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white/50"
                        )}
                    >
                        <Smartphone className="w-4 h-4" /> UPI
                    </button>
                    <button
                        onClick={() => setMethod('Card')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex flex-col items-center gap-1",
                            method === 'Card' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white/50"
                        )}
                    >
                        <CreditCard className="w-4 h-4" /> Card
                    </button>
                    <button
                        onClick={() => setMethod('Net Banking')}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex flex-col items-center gap-1",
                            method === 'Net Banking' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:bg-white/50"
                        )}
                    >
                        <Building2 className="w-4 h-4" /> NetBanking
                    </button>
                </div>

                {}
                <div className="p-6">
                    {!success ? (
                        <form onSubmit={handlePay} className="space-y-4">
                            {}
                            {method === 'UPI' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">UPI ID</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. user@okhdfcanalysis"
                                            required
                                            className="input-field w-full mt-1"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Open your UPI app to approve the request after clicking Pay.</p>
                                </div>
                            )}

                            {}
                            {method === 'Card' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="0000 0000 0000 0000"
                                            required
                                            maxLength={19}
                                            className="input-field w-full mt-1"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                required
                                                maxLength={5}
                                                className="input-field w-full mt-1"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase">CVV</label>
                                            <input
                                                type="password"
                                                placeholder="123"
                                                required
                                                maxLength={3}
                                                className="input-field w-full mt-1"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Card Holder Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name on Card"
                                            required
                                            className="input-field w-full mt-1"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {}
                            {method === 'Net Banking' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Select Bank</label>
                                        <select
                                            required
                                            className="input-field w-full mt-1"
                                            value={bank}
                                            onChange={(e) => setBank(e.target.value)}
                                        >
                                            <option value="">Select Bank</option>
                                            <option value="HDFC">HDFC Bank</option>
                                            <option value="SBI">SBI</option>
                                            <option value="ICICI">ICICI Bank</option>
                                            <option value="AXIS">Axis Bank</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full btn-primary py-3 text-lg font-bold flex items-center justify-center gap-2 mt-4"
                            >
                                {processing ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    `Pay ₹${amount}`
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 mt-4 opacity-50 grayscale">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" className="h-4 object-contain" alt="UPI" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 object-contain" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain" alt="Visa" />
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/30"
                            >
                                <CheckCircle className="w-10 h-10" />
                            </motion.div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
                                <p className="text-muted-foreground">Booking your service request...</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentGatewayModal;
