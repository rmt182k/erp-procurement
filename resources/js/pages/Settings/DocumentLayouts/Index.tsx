import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { Settings2, Upload, Layout, Code, Save, Image as ImageIcon, Eye, FileText, Type, Trash2, X } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState, useEffect, useMemo } from 'react';

interface BrandingAsset {
    id: string; // for local tracking
    path: string | null;
    file: File | null;
    top: number;
    left: number;
    width: number;
    height: string;
    opacity: number;
    z_index: number;
}

interface Template {
    document_type: string;
    template_mode: 'Blade' | 'Image' | 'HTML';
    view_name: string | null;
    header_image_path: string | null;
    branding_assets: BrandingAsset[] | null;
    header_content: string | null;
    footer_content: string | null;
    margin_top: number;
    margin_bottom: number;
    margin_left: number;
    margin_right: number;
    title_text: string | null;
    title_color: string | null;
    subtitle_color: string | null;
    accent_color: string | null;
}

interface Props {
    templates: Record<string, Template>;
}

const DOC_TYPES = ['PO', 'PR', 'INV'];
const BLADE_VIEWS = [
    { id: 'modern', name: 'Modern (Professional)' },
    { id: 'classic', name: 'Classic (Standard)' },
    { id: 'minimal', name: 'Minimalist' }
];

export default function Index({ templates }: Props) {
    const { name: appName } = usePage().props as any;
    const { trans } = useTrans();
    const [activeTab, setActiveTab] = useState('PO');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const currentTemplate = useMemo(() => templates[activeTab] || {
        document_type: activeTab,
        template_mode: 'Blade',
        view_name: 'modern',
        header_image_path: null,
        header_content: '',
        footer_content: '',
        margin_top: 40,
        margin_bottom: 25,
        margin_left: 20,
        margin_right: 20,
        title_text: '',
        title_color: '#000000',
        subtitle_color: '#64748b',
        accent_color: '#16a34a',
    }, [templates, activeTab]);

    const { data, setData, post, processing, errors, reset } = useForm({
        template_mode: currentTemplate.template_mode || 'Blade',
        view_name: currentTemplate.view_name || 'modern',
        header_image: null as File | null,
        branding_assets: (currentTemplate.branding_assets || []).map(a => ({ ...a, id: Math.random().toString(36).substr(2, 9) })),
        header_content: currentTemplate.header_content || '',
        footer_content: currentTemplate.footer_content || '',
        margin_top: currentTemplate.margin_top,
        margin_bottom: currentTemplate.margin_bottom,
        margin_left: currentTemplate.margin_left,
        margin_right: currentTemplate.margin_right,
        title_text: currentTemplate.title_text || '',
        title_color: currentTemplate.title_color || '#000000',
        subtitle_color: currentTemplate.subtitle_color || '#64748b',
        accent_color: currentTemplate.accent_color || '#16a34a',
    });

    // Reset form when tab changes
    useEffect(() => {
        setData((prevData: any) => ({
            ...prevData,
            template_mode: currentTemplate.template_mode,
            view_name: currentTemplate.view_name || 'modern',
            header_image: null,
            branding_assets: (currentTemplate.branding_assets || []).map(a => ({ ...a, id: Math.random().toString(36).substr(2, 9) })),
            header_content: currentTemplate.header_content || '',
            footer_content: currentTemplate.footer_content || '',
            margin_top: currentTemplate.margin_top,
            margin_bottom: currentTemplate.margin_bottom,
            margin_left: currentTemplate.margin_left,
            margin_right: currentTemplate.margin_right,
            title_text: currentTemplate.title_text || '',
            title_color: currentTemplate.title_color || '#000000',
            subtitle_color: currentTemplate.subtitle_color || '#64748b',
            accent_color: currentTemplate.accent_color || '#16a34a',
        }));
        setImagePreview(currentTemplate.header_image_path ? `/storage/${currentTemplate.header_image_path}` : null);
    }, [activeTab, currentTemplate]);

    const addAsset = (file: File) => {
        const newAsset: BrandingAsset = {
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            path: null,
            top: 10,
            left: 10,
            width: 50,
            height: 'auto',
            opacity: 1,
            z_index: 20 + data.branding_assets.length
        };
        setData('branding_assets', [...data.branding_assets, newAsset]);
    };

    const removeAsset = (id: string) => {
        setData('branding_assets', data.branding_assets.filter(a => a.id !== id));
    };

    const updateAsset = (id: string, key: keyof BrandingAsset, value: any) => {
        setData('branding_assets', data.branding_assets.map(a =>
            a.id === id ? { ...a, [key]: value } : a
        ));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('document-templates.update', activeTab));
    };

    const ColorPalette = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
        const colors = [
            '#000000', '#1e293b', '#334155', '#475569', // Slates/Greys
            '#ef4444', '#f97316', '#f59e0b', '#10b981', // Red, Orange, Amber, Green
            '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', // Blue, Indigo, Violet, Fuchsia
            '#164e63', '#065f46', '#7c2d12', '#4c1d95', // Darks
        ];

        return (
            <div className="space-y-3">
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-white rounded-xl border border-gray-100 shadow-inner">
                    {colors.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onChange(c)}
                            className={`h-6 w-6 rounded-md transition-all hover:scale-110 ${value === c ? 'ring-2 ring-indigo-500 ring-offset-1 z-10 scale-110' : 'ring-1 ring-black/5'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <div className="relative col-span-2">
                        <input
                            type="color"
                            value={value || '#000000'}
                            onChange={(e) => onChange(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="h-6 w-full rounded-md border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                            <span className="text-[8px] font-black text-gray-400 uppercase">Custom</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                    <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-widest">{value}</span>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Document Layouts & Branding')}</h2>}
        >
            <Head title={trans('Branding Settings')} />

            <div className="max-w-screen-2xl mx-auto px-4 py-6">
                <div className="flex gap-1 mb-8 bg-gray-100 p-1.5 rounded-xl w-fit shadow-inner">
                    {DOC_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === type ? 'bg-white shadow-md text-indigo-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                        >
                            {type === 'INV' ? 'Invoice' : trans(type)} {trans('Template')}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
                    {/* Settings Form */}
                    <div className="xl:col-span-4 bg-white p-6 shadow-xl ring-1 ring-black/5 sm:rounded-2xl overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-6 text-indigo-700">
                            <Settings2 size={20} />
                            <h3 className="font-bold text-lg">{trans('Design Configuration')}</h3>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            <div>
                                {/* 1. Primary Document Info (Title & Color) */}
                                <div className="space-y-6 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-700">
                                        <Type size={16} />
                                        <h4 className="font-bold text-xs uppercase tracking-widest">{trans('Typography & Colors')}</h4>
                                    </div>

                                    <div>
                                        <InputLabel value={trans('Document Title')} className="mb-1 text-gray-500 font-bold uppercase tracking-tight text-[10px]" />
                                        <TextInput
                                            className="w-full text-sm font-bold placeholder:font-normal"
                                            placeholder={activeTab === 'PO' ? 'Purchase Order' : activeTab === 'PR' ? 'Purchase Requisition' : 'Invoice'}
                                            value={data.title_text}
                                            onChange={(e) => setData('title_text', e.target.value)}
                                        />
                                        <InputError message={errors.title_text} className="mt-1" />
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <InputLabel value={trans('Title Color')} className="mb-2 text-gray-500 font-bold uppercase tracking-tight text-[10px]" />
                                            <ColorPalette value={data.title_color} onChange={(val) => setData('title_color', val)} />
                                            <InputError message={errors.title_color} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel value={trans('Label Color')} className="mb-2 text-gray-500 font-bold uppercase tracking-tight text-[10px]" />
                                                <ColorPalette value={data.subtitle_color} onChange={(val) => setData('subtitle_color', val)} />
                                                <InputError message={errors.subtitle_color} className="mt-1" />
                                            </div>
                                            <div>
                                                <InputLabel value={trans('Accent Color (Status)')} className="mb-2 text-gray-500 font-bold uppercase tracking-tight text-[10px]" />
                                                <ColorPalette value={data.accent_color} onChange={(val) => setData('accent_color', val)} />
                                                <InputError message={errors.accent_color} className="mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. System Preset Selection */}
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Layout size={16} className="text-blue-600" />
                                        <InputLabel value={trans('System Base Layout')} className="font-bold mb-0" />
                                    </div>
                                    <select
                                        className="block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-sm"
                                        value={data.view_name}
                                        onChange={(e) => setData('view_name', e.target.value)}
                                    >
                                        {BLADE_VIEWS.map(v => (
                                            <option key={v.id} value={v.id}>{v.name}</option>
                                        ))}
                                    </select>
                                    <p className="mt-2 text-[10px] text-blue-600 italic">Select the core structure of the document.</p>
                                </div>

                                {/* 3. Image Branding (Logos/Letterheads) */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <ImageIcon size={16} className="text-orange-600" />
                                                <InputLabel value={trans('Graphic Branding Assets')} className="font-bold mb-0" />
                                            </div>
                                            <span className="text-[10px] bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-bold">{data.branding_assets.length}</span>
                                        </div>
                                        <div className="relative border-2 border-dashed border-orange-200 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-orange-100/50 transition-colors group cursor-pointer shadow-inner">
                                            <input
                                                type="file"
                                                onChange={(e) => e.target.files && addAsset(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <Upload size={24} className="text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <InputError message={errors.branding_assets as string} className="mt-1" />
                                    </div>

                                    {/* Asset List */}
                                    <div className="grid grid-cols-1 gap-3">
                                        {data.branding_assets.map((asset, idx) => (
                                            <div key={asset.id} className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all hover:shadow-md">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="h-10 w-10 bg-gray-100 rounded border border-gray-100 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={asset.file ? URL.createObjectURL(asset.file) : `/storage/${asset.path}`}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-[10px] font-black text-indigo-500 uppercase truncate">Asset #{idx + 1}</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAsset(asset.id)}
                                                                className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Remove Asset"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[9px] text-gray-400 truncate">{asset.file ? asset.file.name : 'Stored File'}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <div>
                                                        <label className="text-[8px] text-gray-400 uppercase font-black">Layer</label>
                                                        <select
                                                            value={asset.z_index < 0 ? 'back' : 'front'}
                                                            onChange={(e) => updateAsset(asset.id, 'z_index', e.target.value === 'back' ? -1 : 1)}
                                                            className="w-full text-[10px] p-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                        >
                                                            <option value="back">Behind Content</option>
                                                            <option value="front">On Top of Content</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[8px] text-gray-400 uppercase font-black">Opacity ({Math.round(asset.opacity * 100)}%)</label>
                                                        <input
                                                            type="range"
                                                            min="0.1"
                                                            max="1"
                                                            step="0.1"
                                                            value={asset.opacity}
                                                            onChange={(e) => updateAsset(asset.id, 'opacity', parseFloat(e.target.value))}
                                                            className="w-full mt-2 accent-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 mt-2">
                                                    <div>
                                                        <label className="text-[8px] text-gray-400 uppercase font-black">Top (mm)</label>
                                                        <input
                                                            type="number"
                                                            value={asset.top}
                                                            onChange={(e) => updateAsset(asset.id, 'top', parseInt(e.target.value) || 0)}
                                                            className="w-full text-[10px] p-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[8px] text-gray-400 uppercase font-black">Left (mm)</label>
                                                        <input
                                                            type="number"
                                                            value={asset.left}
                                                            onChange={(e) => updateAsset(asset.id, 'left', parseInt(e.target.value) || 0)}
                                                            className="w-full text-[10px] p-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[8px] text-gray-400 uppercase font-black">Width (mm)</label>
                                                        <input
                                                            type="number"
                                                            value={asset.width}
                                                            onChange={(e) => updateAsset(asset.id, 'width', parseInt(e.target.value) || 0)}
                                                            className="w-full text-[10px] p-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. Custom HTML Markup */}
                                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Code size={16} className="text-purple-600" />
                                        <InputLabel value={trans('Advanced HTML Header')} className="font-bold mb-0" />
                                    </div>
                                    <textarea
                                        className="block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm text-[10px] font-mono bg-gray-900 text-green-400 leading-relaxed"
                                        rows={5}
                                        value={data.header_content}
                                        onChange={(e) => setData('header_content', e.target.value)}
                                        placeholder="<div style='text-align: center;'><h1>MY COMPANY</h1></div>"
                                    />
                                    <p className="mt-2 text-[10px] text-purple-600 leading-tight italic">Inject custom raw HTML into the header safe zone.</p>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    <div className="col-span-2">
                                        <InputLabel value={trans('Header Safe Area')} className="text-[10px] text-indigo-500 uppercase font-black" />
                                        <div className="relative">
                                            <TextInput
                                                type="number"
                                                min={35}
                                                className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                                value={data.margin_top}
                                                onChange={(e) => setData('margin_top', parseInt(e.target.value) || 0)}
                                                onBlur={(e) => setData('margin_top', Math.max(35, parseInt(e.target.value) || 35))}
                                            />
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">TOP</span>
                                        </div>
                                        <InputError message={errors.margin_top} className="mt-1" />
                                    </div>
                                    <div className="col-span-2">
                                        <InputLabel value={trans('Footer Safe Area')} className="text-[10px] text-indigo-500 uppercase font-black" />
                                        <div className="relative">
                                            <TextInput
                                                type="number"
                                                min={20}
                                                className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                                value={data.margin_bottom}
                                                onChange={(e) => setData('margin_bottom', parseInt(e.target.value) || 0)}
                                                onBlur={(e) => setData('margin_bottom', Math.max(20, parseInt(e.target.value) || 20))}
                                            />
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">BTM</span>
                                        </div>
                                        <InputError message={errors.margin_bottom} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel value={trans('Side Padding')} className="text-[10px] text-gray-500 uppercase font-black" />
                                        <div className="relative">
                                            <TextInput
                                                type="number"
                                                min={10}
                                                className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                                value={data.margin_left}
                                                onChange={(e) => setData('margin_left', parseInt(e.target.value) || 0)}
                                                onBlur={(e) => setData('margin_left', Math.max(10, parseInt(e.target.value) || 10))}
                                            />
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">L</span>
                                        </div>
                                    </div>
                                    <div>
                                        <InputLabel value={trans('Side Padding')} className="text-[10px] text-gray-500 uppercase font-black" />
                                        <div className="relative">
                                            <TextInput
                                                type="number"
                                                min={10}
                                                className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                                value={data.margin_right}
                                                onChange={(e) => setData('margin_right', parseInt(e.target.value) || 0)}
                                                onBlur={(e) => setData('margin_right', Math.max(10, parseInt(e.target.value) || 10))}
                                            />
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">R</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value={trans('Custom Footer HTML (Optional)')} className="mb-2" />
                                    <textarea
                                        className="block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl shadow-sm text-xs p-3"
                                        rows={3}
                                        value={data.footer_content}
                                        onChange={(e) => setData('footer_content', e.target.value)}
                                        placeholder="<p style='color: grey;'>Generated automatically by ERP</p>"
                                    />
                                </div>
                                <PrimaryButton disabled={processing} className="w-full h-12 justify-center rounded-xl text-md shadow-lg shadow-indigo-200">
                                    <Save size={18} className="mr-2" /> {trans('Save Layout Settings')}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="xl:col-span-8 bg-gray-100 rounded-2xl flex flex-col shadow-inner relative overflow-hidden group">
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 w-full">
                            <div className="flex items-center gap-2 text-gray-500 uppercase tracking-widest text-[10px] font-black">
                                <Eye size={14} className="text-indigo-500" /> Real-time Interactive Preview
                            </div>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-12 flex justify-center custom-scrollbar bg-slate-200/50">
                            {/* Paper Container */}
                            <div className="bg-white w-[210mm] min-h-[297mm] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative transform transition-transform duration-500 hover:scale-[1.02]">

                                {/* 1. Header Area Preview */}
                                <div
                                    className="absolute top-0 left-0 w-full overflow-hidden flex flex-col transition-all duration-300"
                                    style={{ height: `${data.margin_top}mm` }}
                                >
                                    {/* Combined Branded Preview */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* Image Assets */}
                                        {data.branding_assets.map((asset) => (
                                            <img
                                                key={asset.id}
                                                src={asset.file ? URL.createObjectURL(asset.file) : `/storage/${asset.path}`}
                                                className="absolute"
                                                style={{
                                                    top: `${asset.top}mm`,
                                                    left: `${asset.left}mm`,
                                                    width: `${asset.width}mm`,
                                                    height: asset.height,
                                                    opacity: asset.opacity,
                                                    zIndex: asset.z_index < 0 ? 5 : 20
                                                }}
                                                alt="Asset Preview"
                                            />
                                        ))}

                                        {/* Custom HTML Header */}
                                        {data.header_content && (
                                            <div
                                                className="absolute inset-0 z-0"
                                                dangerouslySetInnerHTML={{ __html: data.header_content }}
                                            />
                                        )}
                                    </div>

                                    {/* Layout Preset Preview */}
                                    <div className={`flex-1 flex flex-col justify-center px-12 transition-all duration-500 z-10 ${data.view_name === 'modern' ? 'border-b-4 border-indigo-600 bg-gradient-to-r from-indigo-50/30 to-transparent' : data.view_name === 'classic' ? 'border-b-2 border-gray-800 bg-gray-50/50' : 'border-b-[1px] border-gray-200 bg-white'}`}>
                                        <div className={`flex justify-between items-start ${data.view_name === 'classic' ? 'flex-col items-center text-center gap-4' : ''}`}>
                                            <div className={`space-y-1 ${data.view_name === 'classic' ? 'order-2' : ''}`}>
                                                <div className={`transition-all flex items-center`}>
                                                    <span className={`text-xl font-black tracking-tighter uppercase whitespace-nowrap`} style={{ color: data.subtitle_color === '#64748b' ? undefined : data.subtitle_color }}>{appName}</span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-[10px] font-bold whitespace-nowrap" style={{ color: data.subtitle_color }}>{trans('Request Date')}: <span className="font-bold uppercase" style={{ color: data.accent_color }}>2026-02-13</span></div>
                                                    <div className="text-[10px] font-bold whitespace-nowrap" style={{ color: data.subtitle_color }}>{trans('Required Date')}: <span className="font-bold uppercase" style={{ color: data.accent_color }}>2026-02-20</span></div>
                                                    <div className="text-[10px] font-bold whitespace-nowrap" style={{ color: data.subtitle_color }}>{trans('Status')}: <span className="uppercase" style={{ color: data.accent_color }}>DRAFT</span></div>
                                                </div>
                                            </div>
                                            <div className={`${data.view_name === 'classic' ? 'order-1 w-full border-b border-gray-200 pb-2 mb-2' : 'text-right'}`}>
                                                <div
                                                    className={`font-black uppercase tracking-tighter transition-all ${data.view_name === 'modern' ? 'text-2xl' : data.view_name === 'classic' ? 'text-3xl font-serif' : 'text-xl text-gray-600'}`}
                                                    style={{ color: data.title_color || undefined }}
                                                >
                                                    {data.title_text || (activeTab === 'PO' ? 'Purchase Order' : activeTab === 'PR' ? 'Purchase Requisition' : 'Invoice')}
                                                </div>
                                                <div className="text-xs font-mono mt-1 opacity-70" style={{ color: data.subtitle_color }}>DOC NO: {activeTab === 'PO' ? 'PO' : activeTab === 'PR' ? 'PR' : 'INV'}/2026/0001</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Margin Guide Overlay */}
                                    <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center border-b-[1px] border-dashed border-blue-400 opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity">
                                        <div className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Header Safe Area: {data.margin_top}mm</div>
                                    </div>
                                </div>

                                {/* 2. Main Content Area */}
                                <div
                                    className="transition-all duration-300"
                                    style={{
                                        paddingTop: `${data.margin_top}mm`,
                                        paddingBottom: `${data.margin_bottom}mm`,
                                        paddingLeft: `${data.margin_left}mm`,
                                        paddingRight: `${data.margin_right}mm`
                                    }}
                                >
                                    <div className="py-12 border-t border-gray-100">
                                        <div className="grid grid-cols-2 gap-12 mb-12">
                                            <div className="space-y-3">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{trans('Vendor')}</div>
                                                <div className="h-4 bg-gray-800/10 rounded w-full"></div>
                                                <div className="h-4 bg-gray-800/10 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-800/10 rounded w-1/2"></div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{trans('Ship To')}</div>
                                                <div className="h-4 bg-gray-800/10 rounded w-full"></div>
                                                <div className="h-4 bg-gray-800/10 rounded w-full"></div>
                                                <div className="h-4 bg-gray-800/10 rounded w-2/3"></div>
                                            </div>
                                        </div>

                                        <div className="mt-12">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50 border-y-2 border-gray-200">
                                                        <th className="py-3 px-2 text-left text-[10px] font-black text-gray-500 uppercase">Item</th>
                                                        <th className="py-3 px-2 text-center text-[10px] font-black text-gray-500 uppercase">Qty</th>
                                                        <th className="py-3 px-2 text-right text-[10px] font-black text-gray-500 uppercase">Price</th>
                                                        <th className="py-3 px-2 text-right text-[10px] font-black text-gray-500 uppercase">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[1, 2, 3].map(i => (
                                                        <tr key={i} className="border-b border-gray-100">
                                                            <td className="py-4 px-2">
                                                                <div className="h-4 bg-gray-100 rounded w-48 mb-1"></div>
                                                                <div className="h-3 bg-gray-50 rounded w-32"></div>
                                                            </td>
                                                            <td className="py-4 px-2 text-center"><div className="h-4 bg-gray-100 rounded w-8 mx-auto"></div></td>
                                                            <td className="py-4 px-2 text-right"><div className="h-4 bg-gray-100 rounded w-20 ml-auto"></div></td>
                                                            <td className="py-4 px-2 text-right"><div className="h-4 bg-gray-100 rounded w-24 ml-auto font-bold opacity-30">Rp 0.00</div></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-12 flex justify-end">
                                            <div className="w-64 space-y-3 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                                <div className="flex justify-between text-[11px] font-bold text-gray-400 tracking-wider font-mono">
                                                    <span>SUBTOTAL</span>
                                                    <span>Rp 0.00</span>
                                                </div>
                                                <div className="flex justify-between text-[11px] font-bold text-gray-400 tracking-wider font-mono">
                                                    <span>TAX (11%)</span>
                                                    <span>Rp 0.00</span>
                                                </div>
                                                <div className="pt-3 border-t-2 border-dashed border-gray-200 flex justify-between text-lg font-black text-indigo-900 tracking-tighter">
                                                    <span>TOTAL</span>
                                                    <span>Rp 0.00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Footer Area Preview */}
                                <div
                                    className="absolute bottom-0 left-0 w-full overflow-hidden flex flex-col justify-center px-12 transition-all duration-300"
                                    style={{ height: `${data.margin_bottom}mm` }}
                                >
                                    <div className="w-full text-center border-t border-gray-100 pt-4 opacity-70">
                                        <div dangerouslySetInnerHTML={{ __html: data.footer_content || `<p class='text-[10px] text-gray-400'>Page 1 - ${activeTab} Generation</p>` }} className="text-[10px] text-gray-600 leading-relaxed" />
                                    </div>

                                    {/* Margin Guide Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 bg-red-500/5 flex items-center justify-center border-t-[1px] border-dashed border-red-400 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ height: `${data.margin_bottom}mm` }}>
                                        <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Footer Safe Area: {data.margin_bottom}mm</div>
                                    </div>
                                </div>

                                {/* Side Margin Guides */}
                                <div className="absolute inset-y-0 left-0 bg-indigo-500/5 flex items-center justify-center border-r-[1px] border-dashed border-indigo-200 opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ width: `${data.margin_left}mm` }}>
                                    <div className="rotate-90 text-[8px] font-black text-indigo-400 whitespace-nowrap">LEFT: {data.margin_left}mm</div>
                                </div>
                                <div className="absolute inset-y-0 right-0 bg-indigo-500/5 flex items-center justify-center border-l-[1px] border-dashed border-indigo-200 opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ width: `${data.margin_right}mm` }}>
                                    <div className="-rotate-90 text-[8px] font-black text-indigo-400 whitespace-nowrap">RIGHT: {data.margin_right}mm</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
