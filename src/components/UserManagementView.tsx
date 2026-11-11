import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  UserX,
  CreditCard,
  HardDrive,
  Clock,
  Smartphone,
  X,
  Zap,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';
import { VPNUser } from '../types';

export const UserManagementView: React.FC = () => {
  const { vpnUsers, addVPNUser, updateVPNUser, deleteVPNUser, addToast, language, vpnServers } = useServer();
  const isFa = language === 'fa';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // New user form states
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dataLimitGB, setDataLimitGB] = useState<number>(60);
  const [maxDevices, setMaxDevices] = useState<number>(2);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<VPNUser | null>(null);

  const filteredUsers = vpnUsers.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      addToast(isFa ? 'نام کاربری الزامی است' : 'Username is required', 'error');
      return;
    }

    await addVPNUser({
      username: username.trim().toLowerCase(),
      fullName: fullName.trim() || username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dataLimitGB: Number(dataLimitGB) || 50,
      maxDevices: Number(maxDevices) || 2,
      status: 'active',
    });

    setUsername('');
    setFullName('');
    setEmail('');
    setPhone('');
    setShowAddModal(false);
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    await updateVPNUser(editingUser.id, editingUser);
    setEditingUser(null);
  };

  const handleCopySubLink = (user: VPNUser) => {
    const fullUrl = `${window.location.origin}${user.subscriptionUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(user.id);
    addToast(isFa ? `لینک سابسکریپشن اختصاصی @${user.username} کپی شد` : 'Subscription URL copied', 'success');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleToggleBlock = (user: VPNUser) => {
    const nextStatus = user.status === 'blocked' ? 'active' : 'blocked';
    updateVPNUser(user.id, { status: nextStatus });
    addToast(
      isFa
        ? `کاربر @${user.username} ${nextStatus === 'blocked' ? 'مسدود شد' : 'فعال گردید'}`
        : `User status changed to ${nextStatus}`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <h2 className="text-xl font-black text-amber-200">
              {isFa ? 'مدیریت کاربران و مشتریان MAHI JOOVOON' : 'Customer & User Management'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            {isFa
              ? 'تعریف کاربران جدید، مدیریت سقف ترافیک و دستگاه، مسدودسازی، تمدید اشتراک و مشاهده تاریخچه خرید'
              : 'Add users, configure bandwidth quotas, multi-device access, and issue subscription tokens.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isFa ? 'افزودن کاربر جدید' : 'Add New Customer'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isFa ? 'جستجو بر اساس نام، نام کاربری، ایمیل یا شماره موبایل...' : 'Search by username, email or phone...'}
            className="w-full pr-9 pl-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 focus:outline-hidden focus:border-amber-400"
        >
          <option value="all">{isFa ? 'همه وضعیت‌ها' : 'All Statuses'}</option>
          <option value="active">{isFa ? 'فعال (Active)' : 'Active'}</option>
          <option value="expired">{isFa ? 'منقضی شده (Expired)' : 'Expired'}</option>
          <option value="blocked">{isFa ? 'مسدود شده (Blocked)' : 'Blocked'}</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">مشخصات کاربر</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4">مصرف حجم</th>
                <th className="py-3.5 px-4">دستگاه‌ها</th>
                <th className="py-3.5 px-4">تاریخ انقضا</th>
                <th className="py-3.5 px-4">لینک اشتراک</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredUsers.map((user) => {
                const isCopied = copiedToken === user.id;
                const percent = Math.min(100, Math.round((user.dataUsedGB / user.dataLimitGB) * 100));

                return (
                  <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full gold-gradient text-black font-bold flex items-center justify-center text-xs">
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{user.fullName}</span>
                          <span className="text-[11px] text-amber-300/90 font-mono">@{user.username}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          user.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : user.status === 'expired'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-500'
                          }`}
                        />
                        {user.status === 'active' ? 'فعال' : user.status === 'expired' ? 'منقضی' : 'مسدود'}
                      </span>
                    </td>

                    {/* Bandwidth Usage */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="space-y-1 w-32">
                        <div className="flex justify-between text-[10px] text-zinc-400">
                          <span>{user.dataUsedGB} GB</span>
                          <span>{user.dataLimitGB} GB</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${percent > 80 ? 'bg-rose-500' : 'bg-amber-400'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Devices */}
                    <td className="py-3.5 px-4 text-zinc-300 font-mono">
                      <span>{user.connectedDevices} / {user.maxDevices} فعال</span>
                    </td>

                    {/* Expiration */}
                    <td className="py-3.5 px-4 text-zinc-300 font-mono text-[11px]">
                      {user.expiresAt}
                    </td>

                    {/* Subscription Link */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleCopySubLink(user)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        title="کپی لینک هوشمند Subscription"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'کپی شد' : 'لینک ساب'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                          title="ویرایش کاربر"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            user.status === 'blocked'
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                          }`}
                          title={user.status === 'blocked' ? 'رفع مسدودیت' : 'مسدودسازی'}
                        >
                          {user.status === 'blocked' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => deleteVPNUser(user.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                          title="حذف کاربر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-amber-200">افزودن کاربر جدید به پنل</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-bold">نام کاربری انگلیسی (Username):</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: reza_alavi"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">نام کامل فارسی:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: رضا علوی"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">شماره همراه (اختیاری):</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">ایمیل (اختیاری):</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">سقف حجم (GB):</label>
                  <input
                    type="number"
                    value={dataLimitGB}
                    onChange={(e) => setDataLimitGB(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">تعداد دستگاه مجاز:</label>
                  <input
                    type="number"
                    value={maxDevices}
                    onChange={(e) => setMaxDevices(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                    min={1}
                    max={10}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient text-black font-bold cursor-pointer"
                >
                  ثبت و صدور اشتراک
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-amber-200">ویرایش اطلاعات کاربر @{editingUser.username}</h3>
              <button onClick={() => setEditingUser(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">نام کامل:</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">سقف حجم (GB):</label>
                  <input
                    type="number"
                    value={editingUser.dataLimitGB}
                    onChange={(e) => setEditingUser({ ...editingUser, dataLimitGB: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">حجم مصرف‌شده (GB):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingUser.dataUsedGB}
                    onChange={(e) => setEditingUser({ ...editingUser, dataUsedGB: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient text-black font-bold cursor-pointer"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
