import { useContext } from 'react';
import { DialogsContext } from '../context';

export function useDialogs() {
    const ctx = useContext(DialogsContext);

    if (!ctx) {
        throw new Error('useDialogs hook was called outside of context, wrap your app with DialogsProvider component');
    }

    return ctx;
}
