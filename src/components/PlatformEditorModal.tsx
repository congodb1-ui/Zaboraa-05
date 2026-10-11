import React, { useState, useEffect, useRef } from 'react';
import { useCustomization } from '../context/CustomizationContext';
import { PlatformShowcase, ArchitectureDesignItem } from '../types/siteData';
import { resolveMediaUrl } from '../data/mediaAssets';
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sliders,
  Maximize2
} from 'lucide-react';

export const PlatformEditorModal: React.FC = () => {
  const { siteConfig, activeEditPlatformId, setActiveEditPlatformId, updatePlatformShowcase } = useCustomization();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subsectionFileInputRef = useRef<HTMLInputElement>(null);

  const currentPlatform = siteConfig.platformShowcases?.find(p => p.id === activeEditPlatformId);

  const [activeTab, setActiveTab] = useState<'general' | 'subsections'>('general');
  const [enabled, setEnabled] = useState<boolean>(true);
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [techTags, setTechTags] = useState<string[]>([]);
  const [designs, setDesigns] = useState<ArchitectureDesignItem[]>([]);
  const [activeEditingDesignIndex, setActiveEditingDesignIndex] = useState<number | null>(null);

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentPlatform) {
      setEnabled(currentPlatform.enabled !== false);
      setTitle(currentPlatform.title);
      setBadge(currentPlatform.badge);
      setDescription(currentPlatform.description);
      setMediaType(currentPlatform.mediaType || 'image');
      setImageUrl(currentPlatform.imageUrl);
      setVideoUrl(currentPlatform.videoUrl || '');
      setVideoDuration(currentPlatform.videoDuration || '');
      setDeliverables([...currentPlatform.keyDeliverables]);
      setTechTags([...currentPlatform.techTags]);
      setDesigns(
        currentPlatform.designs ? currentPlatform.designs.map(d => ({ ...d, enabled: d.enabled !== false })) : []
      );
    }
  }, [currentPlatform, activeEditPlatformId]);

  if (!activeEditPlatformId || !currentPlatform) return null;

  // Upload platform main image directly from local device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload subsection diagram directly from local device
  const handleSubsectionFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDesigns(prev => {
            const next = [...prev];
            next[index] = { ...next[index], imageUrl: reader.result as string };
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformShowcase(currentPlatform.id, {
      enabled,
      title,
      badge,
      description,
      mediaType,
      imageUrl,
      videoUrl,
      videoDuration,
      keyDeliverables: deliverables.filter(d => d.trim().length > 0),
      techTags: techTags.filter(t => t.trim().length > 0),
      designs
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveEditPlatformId(null);
    }, 700);
  };

  const handleAddDeliverable = () => {
    setDeliverables(prev => [...prev, 'New architecture deliverable']);
  };

  const handleUpdateDeliverable = (index: number, val: string) => {
    setDeliverables(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleDeleteDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  // Subsections actions
  const handleToggleDesignEnabled = (index: number) => {
    setDesigns(prev => {
      const next = [...prev];
      const current = next[index];
      next[index] = { ...current, enabled: current.enabled === false ? true : false };
      return next;
    });
  };

  const handleUpdateDesignField = (index: number, field: keyof ArchitectureDesignItem, value: any) => {
    setDesigns(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDeleteDesign = (index: number) => {
    setDesigns(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddNewDesign = () => {
    const newDesign: ArchitectureDesignItem = {
      id: `${currentPlatform.id}-design-${Date.now()}`,
      title: 'New Architecture Module',
      badge: 'Architecture Spec',
      description: 'Comprehensive design specifications and deployment topology for production enterprise clouds.',
      imageUrl: '/assets/images/blueprint_3d_isometric_1791610246387.jpg',
      detailedSpecs: [
        'Dedicated low-latency network interconnect',
        'Automated high-availability failover topology',
        'Enterprise micro-segmentation security policy'
      ],
      components: [
        { name: 'Core Infrastructure Router', role: 'Transit Edge', details: 'High-availability routing fabric' }
      ],
      enabled: true
    };
    setDesigns(prev => [...prev, newDesign]);
    setActiveEditingDesignIndex(designs.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Discipline & Subsections Editor: {currentPlatform.platform}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  enabled ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300' : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                }`}>
                  {enabled ? 'PUBLIC ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Modify discipline details, enable/disable status, and manage subsection architecture diagrams</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveEditPlatformId(null)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: General vs Subsections */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'general'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>General Discipline Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('subsections')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'subsections'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Subsections & Diagrams ({designs.length})</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs overflow-y-auto flex-1 pr-1">
          {activeTab === 'general' ? (
            <div className="space-y-5">
              {/* Discipline Enable / Disable Toggle */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>Discipline Visibility Status</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      enabled ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}>
                      {enabled ? 'Active / Visible' : 'Disabled / Hidden'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">
                    When disabled, this entire discipline is hidden from normal site visitors and search navigation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnabled(!enabled)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-2 ${
                    enabled
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-rose-950 border border-rose-700 text-rose-300 hover:bg-rose-900'
                  }`}
                >
                  {enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{enabled ? 'Discipline: ENABLED' : 'Discipline: DISABLED'}</span>
                </button>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-medium">Discipline Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Badge Tag</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Architectural Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Media Controls: Image or Video */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Visual Media Asset</span>
                  <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setMediaType('image')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        mediaType === 'image'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Show Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        mediaType === 'video'
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Show Video</span>
                    </button>
                  </div>
                </div>

                {mediaType === 'image' ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img
                          src={resolveMediaUrl(imageUrl)}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-slate-400">Architecture Image Path or Local Device Upload</label>
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={e => setImageUrl(e.target.value)}
                          placeholder="/assets/images/... or data:image/..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Direct Local Device Upload Button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-2 px-3 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded-lg text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload Image Directly from Local Device</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-slate-400">Embed Video URL (YouTube / Vimeo / MP4)</label>
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={e => setVideoUrl(e.target.value)}
                          placeholder="https://www.youtube-nocookie.com/embed/..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400">Video Duration</label>
                        <input
                          type="text"
                          value={videoDuration}
                          onChange={e => setVideoDuration(e.target.value)}
                          placeholder="e.g. 24:18"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Deliverables */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium">Key Engineering Deliverables</label>
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Deliverable Bullet</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => handleUpdateDeliverable(idx, e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteDeliverable(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Tags */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Tech Tags (Comma-Separated)</label>
                <input
                  type="text"
                  value={techTags.join(', ')}
                  onChange={e => setTechTags(e.target.value.split(',').map(s => s.trim()))}
                  placeholder="Tag1, Tag2, Tag3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                />
              </div>
            </div>
          ) : (
            /* Subsections Management Tab */
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Subsections & Architecture Modules ({designs.length})
                  </h4>
                  <p className="text-xs text-slate-400">
                    Enable, disable, update diagrams, or upload high-res images directly from your device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewDesign}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Architecture Subsection</span>
                </button>
              </div>

              {/* List of Subsections */}
              <div className="space-y-4">
                {designs.map((design, dIdx) => {
                  const isSubsectionEnabled = design.enabled !== false;
                  return (
                    <div
                      key={design.id || dIdx}
                      className={`p-4 rounded-xl border transition-all space-y-4 ${
                        isSubsectionEnabled
                          ? 'bg-slate-950/80 border-slate-800'
                          : 'bg-slate-950/40 border-rose-950/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                            Module 0{dIdx + 1}
                          </span>
                          <span className="font-bold text-white text-xs truncate max-w-xs">
                            {design.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Enable/Disable Toggle Switch for Subsection */}
                          <button
                            type="button"
                            onClick={() => handleToggleDesignEnabled(dIdx)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                              isSubsectionEnabled
                                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900'
                                : 'bg-rose-950 border-rose-500/50 text-rose-300 hover:bg-rose-900'
                            }`}
                            title={isSubsectionEnabled ? 'Click to disable subsection' : 'Click to enable subsection'}
                          >
                            {isSubsectionEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{isSubsectionEnabled ? 'Active' : 'Disabled'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteDesign(dIdx)}
                            className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                            title="Delete this subsection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Fields: Title, Badge, Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-slate-400 text-[11px]">Subsection Title</label>
                          <input
                            type="text"
                            value={design.title}
                            onChange={e => handleUpdateDesignField(dIdx, 'title', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 text-[11px]">Badge / Tag</label>
                          <input
                            type="text"
                            value={design.badge || ''}
                            onChange={e => handleUpdateDesignField(dIdx, 'badge', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 text-[11px]">Description</label>
                        <textarea
                          rows={2}
                          value={design.description}
                          onChange={e => handleUpdateDesignField(dIdx, 'description', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                        />
                      </div>

                      {/* Diagram Image & Device Upload */}
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-semibold text-slate-300">
                          Architecture Diagram Image
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="w-24 h-16 rounded overflow-hidden bg-black border border-slate-800 shrink-0">
                            <img
                              src={resolveMediaUrl(design.imageUrl)}
                              alt="Diagram thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={design.imageUrl}
                              onChange={e => handleUpdateDesignField(dIdx, 'imageUrl', e.target.value)}
                              placeholder="/assets/images/... or data:image/..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
                            />

                            <div>
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold cursor-pointer transition-colors">
                                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Upload Image Directly from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => handleSubsectionFileUpload(e, dIdx)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setActiveEditPlatformId(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Apply & Save Discipline</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
