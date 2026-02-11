import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { Settings2, Upload, Layout, Code, Save, Image as ImageIcon, Eye, FileText, Type } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState, useEffect, useMemo } from 'react';

interface Template {
    document_type: string;
    template_mode: 'Blade' | 'Image' | 'HTML';
    view_name: string | null;
    header_image_path: string | null;
    header_content: string | null;
    footer_content: string | null;
    margin_top: number;
    margin_bottom: number;
    margin_left: number;
    margin_right: number;
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
    }, [templates, activeTab]);

    const { data, setData, post, processing, errors, reset } = useForm({
        template_mode: currentTemplate.template_mode,
        view_name: currentTemplate.view_name || 'modern',
        header_image: null as File | null,
        header_content: currentTemplate.header_content || '',
        footer_content: currentTemplate.footer_content || '',
        margin_top: currentTemplate.margin_top,
        margin_bottom: currentTemplate.margin_bottom,
        margin_left: currentTemplate.margin_left,
        margin_right: currentTemplate.margin_right,
    });

    // Reset form when tab changes
    useEffect(() => {
        setData((prevData: any) => ({
            ...prevData,
            template_mode: currentTemplate.template_mode,
            view_name: currentTemplate.view_name || 'modern',
            header_image: null,
            header_content: currentTemplate.header_content || '',
            footer_content: currentTemplate.footer_content || '',
            margin_top: currentTemplate.margin_top,
            margin_bottom: currentTemplate.margin_bottom,
            margin_left: currentTemplate.margin_left,
            margin_right: currentTemplate.margin_right,
        }));
        setImagePreview(currentTemplate.header_image_path ? `/storage/${currentTemplate.header_image_path}` : null);
    }, [activeTab, currentTemplate]);

    // Handle Image Preview
    useEffect(() => {
        if (!data.header_image) {
            return;
        }
        const objectUrl = URL.createObjectURL(data.header_image);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [data.header_image]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('document-templates.update', activeTab));
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
                                <InputLabel value={trans('Template Mode')} className="mb-3 text-gray-400 uppercase tracking-widest text-[10px]" />
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'Blade', label: 'System', icon: Layout, desc: 'Built-in presets' },
                                        { id: 'Image', label: 'Letterhead', icon: ImageIcon, desc: 'Full image kop' },
                                        { id: 'HTML', label: 'HTML', icon: Code, desc: 'Custom markup' }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() => setData('template_mode', mode.id as any)}
                                            className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${data.template_mode === mode.id ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-sm' : 'border-gray-100 hover:border-gray-200 grayscale opacity-70 hover:opacity-100 hover:grayscale-0'}`}
                                        >
                                            <mode.icon size={24} className="mb-2" />
                                            <span className="font-bold text-xs">{mode.label}</span>
                                            <span className="text-[10px] opacity-60 text-center mt-1 leading-tight">{mode.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                {data.template_mode === 'Blade' && (
                                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <InputLabel value={trans('System View Selection')} />
                                        <select
                                            className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-sm"
                                            value={data.view_name}
                                            onChange={(e) => setData('view_name', e.target.value)}
                                        >
                                            {BLADE_VIEWS.map(v => (
                                                <option key={v.id} value={v.id}>{v.name}</option>
                                            ))}
                                        </select>
                                        <p className="mt-2 text-[11px] text-blue-600 italic">Predefined professional layouts with logical numbering and spacing.</p>
                                    </div>
                                )}

                                {data.template_mode === 'Image' && (
                                    <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <InputLabel value={trans('Letterhead Image')} />
                                            {imagePreview && <span className="text-[10px] bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">New Ready</span>}
                                        </div>
                                        <div className="relative border-2 border-dashed border-orange-200 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-orange-100/50 transition-colors group cursor-pointer">
                                            <input
                                                type="file"
                                                onChange={(e) => setData('header_image', e.target.files ? e.target.files[0] : null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <Upload size={32} className="text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                                            <p className="text-xs font-medium text-orange-700">Click or drag kop surat image</p>
                                            <p className="text-[10px] text-orange-500 mt-1">PNG, JPG up to 2MB</p>
                                        </div>
                                    </div>
                                )}

                                {data.template_mode === 'HTML' && (
                                    <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                                        <InputLabel value={trans('Custom Header HTML')} />
                                        <textarea
                                            className="mt-2 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-xs font-mono bg-gray-900 text-green-400 leading-relaxed"
                                            rows={8}
                                            value={data.header_content}
                                            onChange={(e) => setData('header_content', e.target.value)}
                                            placeholder="<div style='text-align: center;'><h1>MY COMPANY</h1></div>"
                                        />
                                        <p className="mt-2 text-[10px] text-purple-600 leading-tight">Use inline styles for best compatibility with domPDF.</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <InputLabel value={trans('Top')} className="text-[10px] text-gray-500 uppercase font-black" />
                                    <div className="relative">
                                        <TextInput
                                            type="number"
                                            className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                            value={data.margin_top}
                                            onChange={(e) => setData('margin_top', parseInt(e.target.value) || 0)}
                                        />
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">T</span>
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value={trans('Bottom')} className="text-[10px] text-gray-500 uppercase font-black" />
                                    <div className="relative">
                                        <TextInput
                                            type="number"
                                            className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                            value={data.margin_bottom}
                                            onChange={(e) => setData('margin_bottom', parseInt(e.target.value) || 0)}
                                        />
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">B</span>
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value={trans('Left')} className="text-[10px] text-gray-500 uppercase font-black" />
                                    <div className="relative">
                                        <TextInput
                                            type="number"
                                            className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                            value={data.margin_left}
                                            onChange={(e) => setData('margin_left', parseInt(e.target.value) || 0)}
                                        />
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">L</span>
                                    </div>
                                </div>
                                <div>
                                    <InputLabel value={trans('Right')} className="text-[10px] text-gray-500 uppercase font-black" />
                                    <div className="relative">
                                        <TextInput
                                            type="number"
                                            className="mt-1 block w-full pl-7 px-1 text-xs font-bold h-9"
                                            value={data.margin_right}
                                            onChange={(e) => setData('margin_right', parseInt(e.target.value) || 0)}
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
                                    {data.template_mode === 'Image' && imagePreview && (
                                        <img src={imagePreview} className="w-full h-full object-contain object-top" alt="Header Preview" />
                                    )}

                                    {data.template_mode === 'HTML' && (
                                        <div className="w-full h-full bg-white transition-opacity duration-300" dangerouslySetInnerHTML={{ __html: data.header_content }} />
                                    )}

                                    {data.template_mode === 'Blade' && (
                                        <div className="flex-1 flex flex-col justify-center px-12 border-b-2 border-indigo-500 shadow-sm bg-gradient-to-r from-indigo-50/20 to-transparent">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="h-8 w-40 bg-indigo-700 rounded-md shadow-sm"></div>
                                                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                                                    <div className="h-3 w-28 bg-gray-100 rounded"></div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-indigo-900 uppercase">{activeTab === 'PO' ? 'Purchase Order' : activeTab === 'PR' ? 'Purchase Requisition' : 'Invoice'}</div>
                                                    <div className="text-xs font-mono text-gray-400 mt-1">DOC NO: {activeTab === 'PO' ? 'PO' : activeTab === 'PR' ? 'PR' : 'INV'}/2026/0001</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Margin Guide Overlay */}
                                    <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center border-b-[1px] border-dashed border-blue-400 opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity">
                                        <div className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Header Safe Zone: {data.margin_top}mm</div>
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
                                        <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Footer Safe Zone: {data.margin_bottom}mm</div>
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
