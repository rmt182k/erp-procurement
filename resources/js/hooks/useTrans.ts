import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

export const useTrans = () => {
    const { props } = usePage<PageProps>();
    const translations = props.translations || {};

    const translate = (key: string, replacements: Record<string, string> = {}) => {
        let translation = translations[key] || key;

        Object.keys(replacements).forEach((replacement) => {
            translation = translation.replace(`:${replacement}`, replacements[replacement]);
        });

        return translation;
    };

    return { trans: translate, locale: props.locale };
};
