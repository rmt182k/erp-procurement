import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTrans } from '@/hooks/useTrans';
import { Settings2, Upload, Layout, Code, Save, Image as ImageIcon } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState } from 'react';

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

export default function Index({ templates }: Props) {
    const { trans } = useTrans();
    const [activeTab, setActiveTab] = useState('PO');

    const currentTemplate = templates[activeTab] || {
        document_type: activeTab,
        template_mode: 'Blade',
        view_name: 'modern',
        header_image_path: null,
        header_content: '',
        footer_content: '',
        margin_top: 40,
        margin_bottom: 20,
        margin_left: 20,
        margin_right: 20,
    };

    const { data, setData, post, processing, errors } = useForm({
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we include file upload, we use POST (Laravel will handle it)
        post(route('document-templates.update', activeTab));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{trans('Document Layouts & Branding')}</h2>}
        >
            <Head title={trans('Branding Settings')} />

            <div className="max-w-7xl mx-auto">
                <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                    {DOC_TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === type ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {type} {trans('Template')}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Settings Form */}
                    <div className="lg:col-span-1 bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel value={trans('Template Mode')} />
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('template_mode', 'Blade')}
                                        className={`flex flex-col items-center p-2 border rounded-lg text-[10px] ${data.template_mode === 'Blade' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200'}`}
                                    >
                                        <Layout size={16} className="mb-1" /> System
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('template_mode', 'Image')}
                                        className={`flex flex-col items-center p-2 border rounded-lg text-[10px] ${data.template_mode === 'Image' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200'}`}
                                    >
                                        <ImageIcon size={16} className="mb-1" /> Letterhead
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('template_mode', 'HTML')}
                                        className={`flex flex-col items-center p-2 border rounded-lg text-[10px] ${data.template_mode === 'HTML' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200'}`}
                                    >
                                        <Code size={16} className="mb-1" /> HTML
                                    </button>
                                </div>
                            </div>

                            {data.template_mode === 'Image' && (
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                                    <InputLabel value={trans('Upload Letterhead Image')} />
                                    <input
                                        type="file"
                                        onChange={(e) => setData('header_image', e.target.files ? e.target.files[0] : null)}
                                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <p className="mt-1 text-[10px] text-orange-600 italic">Recommended: A4 Width (2480px) PNG/JPG</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value={trans('Margin Top (mm)')} />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.margin_top}
                                        onChange={(e) => setData('margin_top', parseInt(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <InputLabel value={trans('Margin Bottom (mm)')} />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.margin_bottom}
                                        onChange={(e) => setData('margin_bottom', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel value={trans('Custom Footer HTML')} />
                                <textarea
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm text-sm font-mono"
                                    rows={3}
                                    value={data.footer_content}
                                    onChange={(e) => setData('footer_content', e.target.value)}
                                    placeholder="<p>Payment to: BCA 123456789</p>"
                                />
                            </div>

                            <PrimaryButton disabled={processing} className="w-full justify-center">
                                <Save size={16} className="mr-2" /> {trans('Save Layout')}
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Preview (Simplified) */}
                    <div className="lg:col-span-2 bg-gray-200 p-8 shadow sm:rounded-lg overflow-hidden flex justify-center">
                        <div className="bg-white w-[210mm] h-[297mm] shadow-2xl relative p-8 transform scale-75 origin-top">
                            {/* Visual Guide for Margins */}
                            <div className="absolute top-0 left-0 w-full bg-blue-500 opacity-10 flex items-center justify-center font-bold text-blue-800" style={{ height: `${data.margin_top}mm` }}>
                                HEADER AREA ({data.margin_top}mm)
                            </div>

                            <div className="mt-[20mm]">
                                <h1 className="text-4xl font-black text-gray-300 opacity-20 text-center uppercase tracking-tighter">PREVIEW DUMMY</h1>
                                <div className="mt-20 space-y-4">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center text-gray-300 italic">
                                        Items Table Content
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full bg-red-500 opacity-10 flex items-center justify-center font-bold text-red-800" style={{ height: `${data.margin_bottom}mm` }}>
                                FOOTER AREA ({data.margin_bottom}mm)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
