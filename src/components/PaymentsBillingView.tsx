import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  Users,
  Send,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';
import { VPNSubscriptionPlan } from '../types';

export const PaymentsBillingView: React.FC = () => {
  const { vpnPlans, vpnTransactions, addVPNTransaction, vpnUsers, addToast, language } = useServer();
  const isFa = language === 'fa';

  const [selectedPlan, setSelectedPlan] = useState<VPNSubscriptionPlan>(vpnPlans[1] || vpnPlans[0]);
  const [selectedUserId, setSelectedUserId] = useState<string>(vpnUsers[0]?.id || 'usr-101');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [gateway, setGateway] = useState<'zarinpal' | 'idpay' | 'bale_pay' | 'card_to_card'>('zarinpal');
  const [isProcessing, setIsProcessing] = useState(false);

  // Discount validation
  const discountAmount = discountApplied ? 45000 : 0;
  const basePrice = selectedPlan.discountPriceToman || selectedPlan.priceToman;
  const finalPrice = Math.max(10000, basePrice - discountAmount);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'MAHI_GOLD' || discountCode.trim().toUpperCase() === 'MAHI2026') {
      setDiscountApplied(true);
      addToast(isFa ? 'کد تخفیف طلایی ۴۵,۰۰۰ تومانی با موفقیت اعمال شد!' : 'Discount applied!', 'success');
    } else {
      addToast(isFa ? 'کد تخفیف نامعتبر است (کد تستی: MAHI_GOLD)' : 'Invalid code (test: MAHI_GOLD)', 'error');
    }
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    const user = vpnUsers.find((u) => u.id === selectedUserId) || vpnUsers[0];

    setTimeout(async () => {
      await addVPNTransaction({
        userId: user.id,
        username: user.username,
        planId: selectedPlan.id,
        planName: selectedPlan.persianName,
        amountToman: basePrice,
        discountCode: discountApplied ? discountCode : undefined,
        discountAmountToman: discountAmount,
        finalAmountToman: finalPrice,
        gateway,
        status: 'paid',
        trackingCode: `MAHI-${Math.floor(1000000 + Math.random() * 9000000)}`,
      });

      setIsProcessing(false);
      addToast(isFa ? 'پرداخت تستی با موفقیت ثبت شد و اشتراک کاربر تمدید گردید!' : 'Order completed and subscription renewed!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 font-mono">
              FINANCIAL & ORDER SYSTEM
            </span>
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
            {isFa ? 'سیستم مدیریت پلن‌های اشتراک، پرداخت و سفارشات' : 'Subscription Plans & Billing System'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {isFa
              ? 'خرید و تمدید خودکار اشتراک‌های وی‌آی‌پی، اتصال به درگاه‌های زرین‌پال، آیدی‌پی، درگاه بانکی پیام‌رسان بله و سیستم کارت به کارت اختصاصی مهی جووون.'
              : 'Multi-gateway billing system supporting Iranian banking, Zarinpal, IDPay, Bale Messenger Pay, and card-to-card auto verification.'}
          </p>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {vpnPlans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-950 border-amber-400 shadow-2xl ring-1 ring-amber-400/50'
                  : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full gold-gradient text-black font-black text-[10px] tracking-wide shadow-md">
                  {isFa ? 'محبوب‌ترین پلن' : 'MOST POPULAR'}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-base font-black ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {plan.persianName}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">{plan.durationDays} روزه</span>
                </div>

                <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-zinc-800">
                  <span className="text-2xl font-black text-amber-200 font-mono">
                    {(plan.discountPriceToman || plan.priceToman).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-zinc-400 font-bold">تومان</span>
                  {plan.discountPriceToman && (
                    <span className="text-xs text-zinc-500 line-through mr-2 font-mono">
                      {plan.priceToman.toLocaleString('fa-IR')}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs text-zinc-300 leading-relaxed mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'gold-gradient text-black shadow-lg font-black'
                    : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800'
                }`}
              >
                {isSelected ? (isFa ? '✓ پلن انتخابی شما' : 'Selected') : (isFa ? 'انتخاب این پلن' : 'Select Plan')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout and Simulation Gateway Box */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-500/30 shadow-xl space-y-5">
        <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span>{isFa ? 'تسویه‌حساب و فعال‌سازی اشتراک' : 'Checkout & Instant Activation'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. Customer */}
          <div>
            <label className="block text-zinc-400 mb-1.5 font-bold">انتخاب کاربر خریدار:</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-hidden focus:border-amber-400 font-medium"
            >
              {vpnUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} (@{u.username})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Payment Gateway */}
          <div>
            <label className="block text-zinc-400 mb-1.5 font-bold">درگاه پرداخت:</label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-hidden focus:border-amber-400 font-medium"
            >
              <option value="zarinpal">زرین‌پال (ZarinPal IPG)</option>
              <option value="idpay">آیدی‌پی (IDPay Direct)</option>
              <option value="bale_pay">درگاه پرداخت پیام‌رسان بله (Bale Gateway)</option>
              <option value="card_to_card">کارت به کارت با تأیید خودکار</option>
            </select>
          </div>

          {/* 3. Discount Code */}
          <div>
            <label className="block text-zinc-400 mb-1.5 font-bold">کد تخفیف (کوپن):</label>
            <form onSubmit={handleApplyDiscount} className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="کد: MAHI_GOLD"
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono uppercase"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold border border-amber-400/40 cursor-pointer"
              >
                اعمال
              </button>
            </form>
          </div>
        </div>

        {/* Invoice Summary and Submit */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <div className="text-zinc-400">
              پلن: <strong className="text-white">{selectedPlan.persianName}</strong>
              {discountApplied && <span className="text-emerald-400 mr-2">(تخفیف ۴۵,۰۰۰ تومان کسر شد)</span>}
            </div>
            <div className="text-base font-black text-amber-300 font-mono">
              مبلغ قابل پرداخت: {finalPrice.toLocaleString('fa-IR')} تومان
            </div>
          </div>

          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3 rounded-xl gold-gradient text-black font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>{isProcessing ? 'در حال اتصال به درگاه...' : 'پرداخت آنلاین و تمدید خودکار'}</span>
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-amber-200">تاریخچه آخرین تراکنش‌ها و پرداخت‌ها</h4>
          <span className="text-[11px] font-mono text-zinc-400">{vpnTransactions.length} تراکنش ثبت شده</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-zinc-900/60 text-zinc-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">کد رهگیری</th>
                <th className="py-3 px-4">کاربر</th>
                <th className="py-3 px-4">پلن خریداری‌شده</th>
                <th className="py-3 px-4">مبلغ پرداختی</th>
                <th className="py-3 px-4">درگاه</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-mono">
              {vpnTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-300">{tx.trackingCode}</td>
                  <td className="py-3 px-4 text-white">@{tx.username}</td>
                  <td className="py-3 px-4 text-zinc-300 font-sans">{tx.planName}</td>
                  <td className="py-3 px-4 text-white font-bold">{tx.finalAmountToman.toLocaleString('fa-IR')} ت</td>
                  <td className="py-3 px-4 text-zinc-400 uppercase text-[10px]">{tx.gateway}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        tx.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tx.status === 'paid' ? 'پرداخت موفق' : 'در انتظار'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400 text-[11px]">{tx.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
