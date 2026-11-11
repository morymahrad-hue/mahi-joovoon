import React, { useState } from 'react';
import {
  Folder,
  FileText,
  FileCode,
  FileCog,
  Plus,
  Trash2,
  Edit3,
  Download,
  Search,
  ArrowUp,
  FolderPlus,
  FilePlus,
  Save,
  X,
  ExternalLink,
  Lock,
  Layers,
} from 'lucide-react';
import { FileItem } from '../types';
import { useServer } from '../context/ServerContext';

export const FileManagerView: React.FC = () => {
  const {
    files,
    currentDirectory,
    setCurrentDirectory,
    createFile,
    createFolder,
    deleteFile,
    updateFileContent,
    addToast,
  } = useServer();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  // Quick directory bookmarks
  const bookmarks = [
    { label: '/var/www', path: '/var/www' },
    { label: '/etc/nginx', path: '/etc/nginx' },
    { label: '/etc/systemd/system', path: '/etc/systemd/system' },
    { label: '/home/developer', path: '/home/developer' },
  ];

  // Filter files by current folder and search
  const filteredFiles = files.filter((f) => {
    const isInCurrentDir =
      f.path.startsWith(currentDirectory) ||
      (currentDirectory === '/var/www' && f.path.includes('/var/www')) ||
      (currentDirectory === '/etc/nginx' && f.path.includes('/etc/nginx'));
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'directory') {
      return <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
    }
    if (file.name.endsWith('.py')) {
      return <FileCode className="w-4 h-4 text-blue-400" />;
    }
    if (file.name.endsWith('.js') || file.name.endsWith('.ts')) {
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    }
    if (file.name.endsWith('.conf') || file.name.endsWith('.service') || file.name.endsWith('.env')) {
      return <FileCog className="w-4 h-4 text-emerald-400" />;
    }
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const handleOpenEditor = (file: FileItem) => {
    setEditingFile(file);
    setEditorContent(file.content || `# ${file.name}\n# محتوای خالی فایل`);
  };

  const handleSaveEditor = () => {
    if (!editingFile) return;
    updateFileContent(editingFile.id, editorContent);
    setEditingFile(null);
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    createFile(newItemName.trim(), '# File created via VPS Control Panel\n');
    setNewItemName('');
    setShowNewFileModal(false);
  };

  const handleCreateNewFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    createFolder(newItemName.trim());
    setNewItemName('');
    setShowNewFolderModal(false);
  };

  const handleDownloadFile = (file: FileItem) => {
    const blob = new Blob([file.content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`فایل ${file.name} دانلود شد.`, 'success');
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 font-sans">مسیر جاری:</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
            <span>{currentDirectory}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              setNewItemName('');
              setShowNewFileModal(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>فایل جدید</span>
          </button>
          <button
            onClick={() => {
              setNewItemName('');
              setShowNewFolderModal(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>پوشه جدید</span>
          </button>
        </div>
      </div>

      {/* Bookmarks Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Bookmarks */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <span className="text-slate-500 text-[11px] shrink-0">مسیرهای سریع:</span>
          {bookmarks.map((bm) => (
            <button
              key={bm.path}
              onClick={() => setCurrentDirectory(bm.path)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors shrink-0 cursor-pointer ${
                currentDirectory === bm.path
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {bm.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام فایل‌ها..."
            className="w-full pl-3 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">نام آیتم</th>
                <th className="py-3 px-4 hidden sm:table-cell">سطح دسترسی (Chmod)</th>
                <th className="py-3 px-4 hidden md:table-cell">مالک / گروه</th>
                <th className="py-3 px-4">حجم</th>
                <th className="py-3 px-4 hidden lg:table-cell">آخرین تغییر</th>
                <th className="py-3 px-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(file)}
                      <button
                        onClick={() => {
                          if (file.type === 'directory') {
                            setCurrentDirectory(file.path);
                          } else {
                            handleOpenEditor(file);
                          }
                        }}
                        className="font-medium text-slate-200 hover:text-cyan-300 font-mono text-xs cursor-pointer text-right"
                      >
                        {file.name}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 hidden sm:table-cell">
                    {file.permissions}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 hidden md:table-cell">
                    {file.owner}:{file.group}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                    {file.size}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] hidden lg:table-cell">
                    {file.modified}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <div className="flex items-center justify-end gap-1">
                      {file.type === 'file' && (
                        <>
                          <button
                            onClick={() => handleOpenEditor(file)}
                            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="مشاهده و ویرایش کد"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="دانلود فایل"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="حذف آیتم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Editor Modal */}
      {editingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            {/* Editor Header */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-white">{editingFile.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">({editingFile.path})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEditor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ذخیره تغییرات</span>
                </button>
                <button
                  onClick={() => setEditingFile(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Body Area */}
            <div className="flex-1 flex overflow-hidden bg-slate-950 font-mono text-xs sm:text-sm text-slate-200" dir="ltr">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-full p-4 bg-transparent outline-hidden resize-none leading-relaxed font-mono selection:bg-cyan-500/30"
                spellCheck={false}
              />
            </div>

            {/* Editor Footer Status */}
            <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono" dir="ltr">
              <span>Lines: {editorContent.split('\n').length} | Chars: {editorContent.length}</span>
              <span>Encoding: UTF-8 | Format: UNIX (LF)</span>
            </div>
          </div>
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateNewFile}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-sm w-full shadow-2xl text-right animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-white mb-1">ایجاد فایل جدید</h3>
            <p className="text-xs text-slate-400 mb-4">
              فایل در مسیر <span className="font-mono text-cyan-300">{currentDirectory}</span> ایجاد می‌شود.
            </p>

            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">نام فایل (همراه با پسوند):</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="config.json یا script.py"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewFileModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white cursor-pointer"
              >
                ایجاد فایل
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <form
          onSubmit={handleCreateNewFolder}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-sm w-full shadow-2xl text-right animate-in fade-in">
            <h3 className="text-sm font-bold text-white mb-1">ایجاد پوشه جدید</h3>
            <p className="text-xs text-slate-400 mb-4">
              پوشه در مسیر <span className="font-mono text-cyan-300">{currentDirectory}</span> ساخته می‌شود.
            </p>

            <div className="mb-4">
              <label className="block text-xs text-slate-300 mb-1">نام پوشه:</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="microservices یا uploads"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white cursor-pointer"
              >
                ایجاد پوشه
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
