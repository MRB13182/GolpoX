import React, { useState, useRef } from 'react';
import { 
  Upload, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Monitor, 
  Smartphone, 
  Globe, 
  Share2, 
  FileCode, 
  Zap, 
  Layers, 
  Compass, 
  Info,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { BRAND_LOGO, BRAND_LOGO_STORAGE_PATH, SUPPORTED_LOGO_FORMATS } from '../../config/branding';
import { GOLPOX_LOGO_SOURCE_ID } from '../../services/brandingService';

export const LogoUploadManager: React.FC = () => {
  const { logoBranding, uploadLogo, deleteLogo, addToast } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewBg, setPreviewBg] = useState<'light' | 'dark' | 'checker'>('light');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'canvas' | 'locations'>('canvas');

  // Copy to clipboard helper
  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: `${label} copied successfully.`,
    });
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  // Handle file selection (Upload / Replace)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await executeUpload(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await executeUpload(file);
    }
  };

  const executeUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const result = await uploadLogo(file);
      if (result.success) {
        // Success notification handled in uploadLogo
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to reset to the default master logo (public/logos/golpox-logo.png)?')) {
      deleteLogo();
    }
  };

  // Master paths
  const storagePathString = BRAND_LOGO_STORAGE_PATH; // "public/logos/golpox-logo.png"
  const webRelativePath = BRAND_LOGO; // "/logos/golpox-logo.png"
  const absoluteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${BRAND_LOGO}` 
    : `https://golpox.com${BRAND_LOGO}`;

  return (
    <div className="space-y-8 text-left">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.svg,.webp,image/png,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 1. Header & Breadcrumb */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            {/* Menu Path: Super Admin -> Website Settings -> Branding */}
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-slate-600">Super Admin</span>
              <span>→</span>
              <span className="text-slate-600">Website Settings</span>
              <span>→</span>
              <span className="text-purple-700 font-extrabold">Branding</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              Logo Upload Manager
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Centralized master logo system for GolpoX. Uploading overwrites the master file and instantly refreshes all 13 website locations.
            </p>
          </div>

          {/* Action Buttons: Upload, Replace, Delete */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="upload-logo-btn"
              onClick={triggerFileInput}
              disabled={isProcessing}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/25 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Logo</span>
            </button>

            <button
              id="replace-logo-btn"
              onClick={triggerFileInput}
              disabled={isProcessing}
              className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Replace Logo</span>
            </button>

            <button
              id="delete-logo-btn"
              onClick={handleDelete}
              disabled={isProcessing || !logoBranding.isCustom}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={!logoBranding.isCustom ? 'Currently using default master logo' : 'Reset to default logo'}
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        {/* Current Logo & Master Config Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>Current Master Logo</span>
              <FileCode className="w-3 h-3 text-purple-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950 font-mono tracking-tight">
                Current Logo: {storagePathString}
              </span>
              <button
                onClick={() => handleCopy(storagePathString, 'storagePath', 'Current Logo')}
                className="p-1 rounded-lg hover:bg-purple-200/60 text-purple-700 transition-colors cursor-pointer"
                title="Copy Logo Path"
              >
                {copiedKey === 'storagePath' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>Web Path (BRAND_LOGO)</span>
              <Globe className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 font-mono truncate mr-2">
                {webRelativePath}
              </span>
              <button
                onClick={() => handleCopy(webRelativePath, 'webPath', 'Web Relative Path')}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Copy Web Path"
              >
                {copiedKey === 'webPath' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
              <span>Supported Formats</span>
              <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-extrabold">
                {SUPPORTED_LOGO_FORMATS.join(', ')}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800">
              Format: {logoBranding.format} • {(logoBranding.fileSizeBytes / 1024).toFixed(1)} KB
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-emerald-700 text-[11px] font-bold">
              <span>Website Auto-Sync</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>13 / 13 Locations Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative rounded-3xl p-8 sm:p-10 border-2 border-dashed transition-all cursor-pointer text-center group ${
          isDragging 
            ? 'border-purple-600 bg-purple-50/80 scale-[1.01]' 
            : 'border-slate-300 hover:border-purple-400 bg-white/70 hover:bg-purple-50/20'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Drag and drop your GolpoX logo here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-purple-600 font-bold underline">browse file from your device</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-extrabold border border-slate-200">
              PNG
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-extrabold border border-slate-200">
              SVG
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-extrabold border border-slate-200">
              WEBP
            </span>
            <span className="text-slate-400 text-xs">• Max 5MB</span>
          </div>
        </div>
      </div>

      {/* 3. Copyable Path & URL Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              <span>Logo Asset URL & Direct Paths</span>
            </h3>
            <p className="text-xs text-slate-500">
              Use these copyable URLs to reference the single source logo in external apps, CDNs, or scripts.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Single Source ID: {GOLPOX_LOGO_SOURCE_ID}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Storage Path */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Internal Storage Path</span>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-purple-900 truncate mr-2">
                {storagePathString}
              </span>
              <button
                onClick={() => handleCopy(storagePathString, 'path1', 'Storage Path')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Copy Path"
              >
                {copiedKey === 'path1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Web Path */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Web Asset Relative Path</span>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-purple-900 truncate mr-2">
                {webRelativePath}
              </span>
              <button
                onClick={() => handleCopy(webRelativePath, 'path2', 'Web Relative Path')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Copy Web Path"
              >
                {copiedKey === 'path2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Absolute URL */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Absolute URL</span>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-purple-900 truncate mr-2">
                {absoluteUrl}
              </span>
              <button
                onClick={() => handleCopy(absoluteUrl, 'path3', 'Absolute URL')}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer shrink-0"
                title="Copy Absolute URL"
              >
                {copiedKey === 'path3' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Preview Logo Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <span>Preview Logo Section</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive high-fidelity preview across light/dark surfaces and all website auto-applied placements.
            </p>
          </div>

          {/* Toggle Preview Sub-view */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActivePreviewTab('canvas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activePreviewTab === 'canvas' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Surface Canvas
            </button>
            <button
              onClick={() => setActivePreviewTab('locations')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activePreviewTab === 'locations' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auto Apply Locations (13)
            </button>
          </div>
        </div>

        {/* View A: Surface Canvas */}
        {activePreviewTab === 'canvas' && (
          <div className="space-y-4">
            
            {/* Surface Canvas Background Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Background Surface:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewBg('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    previewBg === 'light' 
                      ? 'bg-white text-slate-900 border-purple-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Light Theme
                </button>
                <button
                  onClick={() => setPreviewBg('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    previewBg === 'dark' 
                      ? 'bg-slate-900 text-white border-purple-500 shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Dark Theme
                </button>
                <button
                  onClick={() => setPreviewBg('checker')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    previewBg === 'checker' 
                      ? 'bg-purple-100 text-purple-900 border-purple-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Transparent Grid
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div
              className={`rounded-3xl p-10 sm:p-14 min-h-[220px] flex items-center justify-center border transition-all ${
                previewBg === 'light'
                  ? 'bg-[#FAF7F2] border-slate-200'
                  : previewBg === 'dark'
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50 border-slate-300'
              }`}
            >
              <div className="text-center space-y-3">
                <Logo 
                  variant="full" 
                  size="xl" 
                  dark={previewBg === 'dark'} 
                  className="mx-auto" 
                />
                <p className={`text-[11px] font-medium ${previewBg === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Single Source Identifier: <strong className="font-mono">{GOLPOX_LOGO_SOURCE_ID}</strong>
                </p>
              </div>
            </div>

            {/* Logo Specifications Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Format</span>
                <span className="font-bold text-slate-800">{logoBranding.format}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Dimensions</span>
                <span className="font-bold text-slate-800">{logoBranding.width || 280} × {logoBranding.height || 80} px</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Source</span>
                <span className="font-bold text-purple-700">{logoBranding.isCustom ? 'Custom Upload' : 'Official Vector'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[11px]">Last Updated</span>
                <span className="font-bold text-slate-800">{new Date(logoBranding.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        )}

        {/* View B: 13 Auto-Applied Locations Matrix */}
        {activePreviewTab === 'locations' && (
          <div className="space-y-4">
            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200/80 text-xs text-purple-900 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Automated Propagation Active:</strong> Whenever you upload or replace the logo via this manager, all 13 locations automatically refresh simultaneously with zero code edits needed.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* 1. Header Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Monitor className="w-3.5 h-3.5 text-purple-600" />
                    <span>1. Header Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <Logo variant="full" size="sm" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Navbar top bar</p>
              </div>

              {/* 2. Mobile Header Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                    <span>2. Mobile Header Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <Logo variant="full" size="sm" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Mobile responsive top bar</p>
              </div>

              {/* 3. Sidebar / Mobile Drawer Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    <span>3. Sidebar Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <Logo variant="full" size="sm" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Mobile drawer & navigation</p>
              </div>

              {/* 4. Footer Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Compass className="w-3.5 h-3.5 text-purple-600" />
                    <span>4. Footer Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-center">
                  <Logo variant="full" size="sm" dark={true} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Site-wide footer brand column</p>
              </div>

              {/* 5. Login Page Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>5. Login Page Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-3 rounded-xl flex items-center justify-center">
                  <Logo variant="full" size="sm" dark={true} showTagline={false} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Auth modal sign in view</p>
              </div>

              {/* 6. Registration Page Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>6. Registration Page Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-3 rounded-xl flex items-center justify-center">
                  <Logo variant="full" size="sm" dark={true} showTagline={false} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Auth modal author sign up</p>
              </div>

              {/* 7. User Dashboard Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>7. User Dashboard Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <Logo variant="full" size="sm" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Reader hub & profile header</p>
              </div>

              {/* 8. Author Dashboard Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Monitor className="w-3.5 h-3.5 text-purple-600" />
                    <span>8. Author Dashboard Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-center">
                  <Logo variant="full" size="sm" />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Author creator studio header</p>
              </div>

              {/* 9. Admin Dashboard Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>9. Admin Dashboard Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-center">
                  <Logo variant="full" size="sm" dark={true} />
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Super admin command center</p>
              </div>

              {/* 10. Browser Favicon */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-600" />
                    <span>10. Browser Favicon</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Synced</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-md bg-slate-100 p-0.5 flex items-center justify-center shrink-0 border border-slate-200">
                    <Logo variant="icon" size="sm" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">GolpoX - Master Favicon</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">&lt;link rel="icon"&gt;</p>
              </div>

              {/* 11. SEO Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <FileCode className="w-3.5 h-3.5 text-purple-600" />
                    <span>11. SEO Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Synced</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 truncate">
                  schema.org &lt;meta name="logo"&gt;
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Search engine crawler metadata</p>
              </div>

              {/* 12. Open Graph Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>12. Open Graph Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Synced</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 truncate">
                  &lt;meta property="og:image"&gt;
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Facebook, WhatsApp & social embeds</p>
              </div>

              {/* 13. Social Share Logo */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <Share2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>13. Social Share Logo</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Synced</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 truncate">
                  &lt;meta name="twitter:image"&gt;
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Twitter/X preview card image</p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 5. Speed & Mobile Optimization Specifications */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5 text-purple-300 text-xs font-bold">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Performance & Mobile Delivery Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Above-The-Fold Eager Loading</span>
            </h4>
            <p className="text-purple-200/80 text-[11px] leading-relaxed">
              Logos in headers and mobile drawers utilize <code className="text-white">loading="eager"</code> and asynchronous decoding to prevent Layout Shift (CLS).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>High-DPI & Mobile Retina Ready</span>
            </h4>
            <p className="text-purple-200/80 text-[11px] leading-relaxed">
              Vector SVG and high-resolution PNG/WEBP assets render with sub-pixel sharpness across iPhone, iPad, and Android displays.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-1">
            <h4 className="font-bold text-white flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Zero Re-render Propagation</span>
            </h4>
            <p className="text-purple-200/80 text-[11px] leading-relaxed">
              React context synchronizes the single source identifier <code className="text-white">GOLPOX_MAIN_LOGO</code> seamlessly across the DOM.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
