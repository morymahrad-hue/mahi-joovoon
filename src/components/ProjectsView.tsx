import React, { useState } from 'react';
import {
  Boxes,
  Play,
  Square,
  RotateCw,
  Plus,
  RefreshCw,
  Terminal,
  FileCode,
  Trash2,
  Sliders,
  ExternalLink,
  CheckCircle2,
  Clock,
  GitBranch,
  Settings2,
  X,
  PlusCircle,
  Copy,
} from 'lucide-react';
import { Project, ProjectFramework, ProjectRuntime } from '../types';
import { useServer } from '../context/ServerContext';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    startProject,
    stopProject,
    restartProject,
    toggleAutoRestart,
    addProject,
    deleteProject,
    rebuildProject,
    updateProjectEnv,
    addToast,
  } = useServer();

  const [activeFilter, setActiveFilter] = useState<'all' | 'nodejs' | 'python' | 'running' | 'stopped'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLogsProject, setSelectedLogsProject] = useState<Project | null>(null);
  const [selectedEnvProject, setSelectedEnvProject] = useState<Project | null>(null);

  // New Project Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newPersianTitle, setNewPersianTitle] = useState('');
  const [newRuntime, setNewRuntime] = useState<ProjectRuntime>('nodejs');
  const [newFramework, setNewFramework] = useState<ProjectFramework>('Express');
  const [newPort, setNewPort] = useState(3050);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'nodejs') return p.runtime === 'nodejs';
    if (activeFilter === 'python') return p.runtime === 'python';
    if (activeFilter === 'running') return p.status === 'running';
    if (activeFilter === 'stopped') return p.status === 'stopped';
    return true;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    addProject({
      name: newProjectName.trim().toLowerCase().replace(/\s+/g, '-'),
      persianTitle: newPersianTitle.trim() || newProjectName.trim(),
      runtime: newRuntime,
      framework: newFramework,
      port: Number(newPort),
    });

    setNewProjectName('');
    setNewPersianTitle('');
    setShowAddModal(false);
  };

  const handleCopyLogs = (logs: string[]) => {
    navigator.clipboard.writeText(logs.join('\n'));
    addToast('لاگ‌های پروژه در کلیپ‌بورد کپی شدند.', 'info');
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Add Project button */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Boxes className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">مدیریت برنامه‌های پایتون و نود‌جی‌اس</h2>
          </div>
          <p className="text-xs text-slate-400">
            کنترل پروسس‌ها، راه‌اندازی خودکار (Auto-Restart)، مدیریت پورت‌ها و مشاهده لاگ‌های زنده کانتینرها.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-sm self-stretch sm:self-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن پروژه جدید</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs w-full sm:w-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          همه پروژه‌ها ({projects.length})
        </button>
        <button
          onClick={() => setActiveFilter('nodejs')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeFilter === 'nodejs'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Node.js ({projects.filter((p) => p.runtime === 'nodejs').length})
        </button>
        <button
          onClick={() => setActiveFilter('python')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeFilter === 'python'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Python ({projects.filter((p) => p.runtime === 'python').length})
        </button>
        <button
          onClick={() => setActiveFilter('running')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeFilter === 'running'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          در حال اجرا ({projects.filter((p) => p.status === 'running').length})
        </button>
        <button
          onClick={() => setActiveFilter('stopped')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            activeFilter === 'stopped'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          متوقف شده ({projects.filter((p) => p.status === 'stopped').length})
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between gap-4"
          >
            {/* Project Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        project.status === 'running'
                          ? 'bg-emerald-400 animate-status-pulse'
                          : project.status === 'restarting'
                          ? 'bg-amber-400 animate-spin'
                          : 'bg-slate-600'
                      }`}
                    />
                    <h3 className="font-bold text-sm text-white">{project.persianTitle}</h3>
                  </div>
                  <div className="font-mono text-xs text-slate-400">
                    {project.name}
                  </div>
                </div>

                {/* Runtime tag */}
                <div className="text-right">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                    {project.runtime === 'python' ? '🐍 Python' : '🟢 Node.js'} · {project.framework}
                  </span>
                </div>
              </div>

              {/* Specs & Metrics */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800/80 my-3 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">پورت سیستم</span>
                  <span className="text-white font-bold">{project.port}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">شناسه پروسس (PID)</span>
                  <span className="text-cyan-300 font-bold">{project.pid || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">مصرف RAM</span>
                  <span className="text-emerald-400 font-bold">{project.memory} MB</span>
                </div>
              </div>

              {/* Git commit and path */}
              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                  <span>{project.gitBranch}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 truncate">{project.gitCommit}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono">
                  Path: {project.rootPath}
                </div>
              </div>
            </div>

            {/* Bottom Controls: Auto-restart toggle + Action buttons */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              {/* Auto-restart switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={project.autoRestart}
                  onChange={() => toggleAutoRestart(project.id)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative" />
                <span className="text-xs text-slate-300">راه‌اندازی خودکار (Systemd)</span>
              </label>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                {project.status === 'running' ? (
                  <>
                    <button
                      onClick={() => restartProject(project.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="راه‌اندازی مجدد"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => stopProject(project.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                      title="توقف موقت"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startProject(project.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>شروع</span>
                  </button>
                )}

                <button
                  onClick={() => rebuildProject(project.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  title="بیلد و استقرار مجدد (Deploy)"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedLogsProject(project)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="مشاهده لاگ‌ها"
                >
                  <Terminal className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedEnvProject(project)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                  title="متغیرهای محیطی .env"
                >
                  <Settings2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="حذف پروژه"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateProject}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl text-right animate-in fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>افزودن و استقرار پروژه جدید</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">عنوان فارسی پروژه:</label>
                <input
                  type="text"
                  value={newPersianTitle}
                  onChange={(e) => setNewPersianTitle(e.target.value)}
                  placeholder="مثال: سرویس پرداخت فروشگاه"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">نام سیستمی / اسلاگ انگلیسی:</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="payment-service-api"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">محیط اجرا (Runtime):</label>
                  <select
                    value={newRuntime}
                    onChange={(e) => {
                      const rt = e.target.value as ProjectRuntime;
                      setNewRuntime(rt);
                      setNewFramework(rt === 'nodejs' ? 'Express' : 'FastAPI');
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="nodejs">Node.js (v22)</option>
                    <option value="python">Python (v3.12)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">فریم‌ورک:</label>
                  <select
                    value={newFramework}
                    onChange={(e) => setNewFramework(e.target.value as ProjectFramework)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  >
                    {newRuntime === 'nodejs' ? (
                      <>
                        <option value="Express">Express</option>
                        <option value="Next.js">Next.js</option>
                        <option value="NestJS">NestJS</option>
                      </>
                    ) : (
                      <>
                        <option value="FastAPI">FastAPI</option>
                        <option value="Flask">Flask</option>
                        <option value="Django">Django</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">پورت اختصاصی (Port):</label>
                <input
                  type="number"
                  value={newPort}
                  onChange={(e) => setNewPort(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-hidden focus:border-cyan-500"
                  min={1024}
                  max={65535}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white cursor-pointer"
              >
                استقرار و راه‌اندازی پروژه
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live Logs Modal */}
      {selectedLogsProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full h-[75vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">لاگ‌های زنده: {selectedLogsProject.persianTitle}</span>
                <span className="font-mono text-slate-400">({selectedLogsProject.name})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLogs(selectedLogsProject.logs)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="کپی لاگ‌ها"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedLogsProject(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-y-auto leading-relaxed space-y-1" dir="ltr">
              {selectedLogsProject.logs.map((log, idx) => (
                <div key={idx} className="hover:bg-slate-900/50 p-0.5 rounded">
                  {log}
                </div>
              ))}
            </div>

            <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 text-[11px] text-slate-500 font-mono flex justify-between" dir="ltr">
              <span>Streaming: Active</span>
              <span>PID: {selectedLogsProject.pid || 'Stopped'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Env Vars Modal */}
      {selectedEnvProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 shadow-2xl text-right animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-amber-400" />
                <span>متغیرهای محیطی ({selectedEnvProject.name} .env)</span>
              </h3>
              <button
                onClick={() => setSelectedEnvProject(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {Object.entries(selectedEnvProject.envVars).map(([key, val]) => (
                <div key={key} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono" dir="ltr">
                  <span className="text-cyan-400 font-bold">{key}</span> ={' '}
                  <span className="text-slate-300">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedEnvProject(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
              >
                تأیید و بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
