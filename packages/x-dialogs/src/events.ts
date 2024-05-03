import { Dialog, Dialogs, OpenConfirmDialog, OpenContentDialog, OpenContextDialog } from './context';
import { createUseExternalEvents } from './utils/create-use-external-events';

type DialogsEvents = {
    openDialog: (payload: OpenContentDialog) => void;
    closeDialog: (id: string) => void;
    closeContextDialog: <TKey extends Dialog>(id: TKey) => void;
    closeAllDialogs: () => void;
    openConfirmDialog: (payload: OpenConfirmDialog) => void;
    openContextDialog: <TKey extends Dialog>(
        payload: OpenContextDialog<Parameters<Dialogs[TKey]>[0]['innerProps']> & { dialog: TKey },
    ) => void;
};

export const [useDialogsEvents, createEvent] = createUseExternalEvents<DialogsEvents>('mui-dialogs');

export const openDialog = createEvent('openDialog');

export const closeDialog = createEvent('closeDialog');

export const closeContextDialog: DialogsEvents['closeContextDialog'] = <TKey extends Dialog>(id: TKey) =>
    createEvent('closeContextDialog')(id);

export const closeAllDialogs = createEvent('closeAllDialogs');

export const openConfirmDialog = createEvent('openConfirmDialog');

export const openContextDialog: DialogsEvents['openContextDialog'] = <TKey extends Dialog>(
    payload: OpenContextDialog<Parameters<Dialogs[TKey]>[0]['innerProps']> & { dialog: TKey },
) => createEvent('openContextDialog')(payload);

export const dialogs: {
    close: DialogsEvents['closeDialog'];
    closeAll: DialogsEvents['closeAllDialogs'];
    open: DialogsEvents['openDialog'];
    confirm: DialogsEvents['openConfirmDialog'];
    context: DialogsEvents['openContextDialog'];
} = {
    close: closeDialog,
    closeAll: closeAllDialogs,
    open: openDialog,
    confirm: openConfirmDialog,
    context: openContextDialog,
};
