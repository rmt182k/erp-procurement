import React from 'react';
import { Link } from '@inertiajs/react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export const Pagination: React.FC<Props> = ({ links }) => {
    if (links.length <= 3) return null; // No need for pagination if only "previous", "1", "next"

    return (
        <div className="flex flex-wrap gap-1">
            {links.map((link, key) => {
                return link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-gray-400 border border-gray-100 rounded-lg bg-white"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={cls(
                            "px-4 py-2 text-sm border rounded-lg transition-all",
                            link.active
                                ? "bg-indigo-600 border-indigo-600 text-white font-bold"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-300"
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
};

function cls(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
