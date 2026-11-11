import React, { useState } from 'react';
import {
  Headphones,
  Send,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Shield,
  X,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';
import { VPNSupportTicket } from '../types';

export const SupportTicketsView: React.FC = () => {
  const { vpnTickets, addVPNTicket, replyVPNTicket, vpnUsers, addToast, language } = useServer();
  const isFa = language === 'fa';

  const [selectedTicketId, setSelectedTicketId] = useState<string>(vpnTickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Ticket Form
  const [subject, setSubject] = useState('');
  const [userId, setUserId] = useState(vpnUsers[0]?.id || 'usr-101');
  const [category, setCategory] = useState<'connection' | 'payment' | 'speed' | 'setup' | 'other'>('connection');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [initialMessage, setInitialMessage] = useState('');

  const selectedTicket = vpnTickets.find((t) => t.id === selectedTicketId) || vpnTickets[0];

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    await replyVPNTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;

    const user = vpnUsers.find((u) => u.id === userId) || vpnUsers[0];
    await addVPNTicket({
      userId: user.id,
      username: user.username,
      subject: subject.trim(),
      category,
      priority,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: user.fullName || user.username,
          message: initialMessage.trim(),
          timestamp: new Date().toLocaleTimeString('fa-IR'),
        },
      ],
    });

    setSubject('');
    setInitialMessage('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            <h2 className="text-xl font-black text-amber-200">
              {isFa ? 'سیستم تیکتینگ و پشتیبانی ۲۴/۷ مشتریان' : 'Customer Support & Ticketing Hub'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            {isFa
              ? 'پاسخگویی سریع به مشکلات اتصال، دریافت گزارش اپراتورها و راهنمایی تنظیم کلاینت‌ها'
              : 'Direct communication desk for network inquiries, client setups, and billing support.'}
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isFa ? 'ثبت تیکت جدید' : 'New Ticket'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Ticket List (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-3 shadow-xl space-y-2 overflow-y-auto max-h-[620px]">
          <span className="text-[11px] font-bold text-zinc-400 px-2 block mb-1">
            لیست درخواست‌ها ({vpnTickets.length}):
          </span>

          {vpnTickets.map((t) => {
            const isSelected = selectedTicket?.id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-400 shadow-md'
                    : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white truncate max-w-[180px]">{t.subject}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      t.status === 'answered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {t.status === 'answered' ? 'پاسخ داده شد' : 'در انتظار پاسخ'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>@{t.username}</span>
                  <span>{t.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket Chat Body (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          {selectedTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-200">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
                    <span>کاربر: @{selectedTicket.username}</span>
                    <span>·</span>
                    <span>دسته‌بندی: {selectedTicket.category}</span>
                    <span>·</span>
                    <span className="text-amber-400 font-bold">اولویت {selectedTicket.priority}</span>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono">
                  شناسه: {selectedTicket.id}
                </span>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[400px]">
                {selectedTicket.messages.map((m) => {
                  const isAdmin = m.sender === 'admin';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-500/30 text-amber-100'
                            : 'bg-zinc-800 text-white rounded-br-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-zinc-400 font-bold">
                          <span>{m.senderName}</span>
                          <span className="font-mono">{m.timestamp}</span>
                        </div>
                        <p>{m.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ ادمین به تیکت کاربر را بنویسید..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5 fill-black" />
                  <span>ارسال پاسخ</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-24 text-zinc-500 text-xs">
              تیکتی انتخاب نشده است.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-amber-200">ثبت تیکت پشتیبانی جدید</h3>
              <button onClick={() => setShowNewModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">موضوع تیکت:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: قطعی موقت در همراه اول"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">کاربر:</label>
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    {vpnUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} (@{u.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">دسته‌بندی:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="connection">اتصال و فیلترینگ</option>
                    <option value="speed">افت سرعت و پینگ</option>
                    <option value="payment">پرداخت و فاکتور</option>
                    <option value="setup">تنظیم برنامه و کلاینت</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-bold">متن پیام:</label>
                <textarea
                  rows={4}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="توضیحات درخواست..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient text-black font-bold cursor-pointer"
                >
                  ارسال تیکت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
