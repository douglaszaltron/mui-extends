import { DialogProps } from '@mui/material/Dialog';
import { DialogTitleProps } from '@mui/material/DialogTitle';
import React, { ReactNode } from 'react';
import { ConfirmDialogProps } from './ConfirmDialog';
import { ContentDialogProps } from './ContentDialog';

export type DialogSettings = Partial<Omit<DialogProps, 'open'>> & { dialogId?: string; titleProps?: DialogTitleProps };

export type ActionLabels = Partial<Record<'confirm' | 'cancel' | 'close', ReactNode>>;

export interface OpenContentDialog extends DialogSettings, ContentDialogProps {}

export interface OpenConfirmDialog extends DialogSettings, ConfirmDialogProps {}
export interface OpenContextDialog<CustomProps extends Record<string, any> = {}> extends DialogSettings {
    innerProps: CustomProps;
}

export interface ContextDialogProps<T extends Record<string, any> = {}> {
    context: DialogsContextProps;
    innerProps: T;
    id: string;
}

export type DialogState =
    | { id: string; props: OpenContentDialog; type: 'content' }
    | { id: string; props: OpenConfirmDialog; type: 'confirm' }
    | { id: string; props: OpenContextDialog; type: 'context'; ctx: string };

export interface DialogsContextProps {
    dialogs: DialogState[];
    openDialog: (props: OpenContentDialog) => string;
    openConfirmDialog: (props: OpenConfirmDialog) => string;
    openContextDialog: <TKey extends Dialog>(
        dialog: TKey,
        props: OpenContextDialog<Parameters<Dialogs[TKey]>[0]['innerProps']>,
    ) => string;
    closeDialog: (id: string, canceled?: boolean) => void;
    closeContextDialog: <TKey extends Dialog>(id: TKey, canceled?: boolean) => void;
    closeAll: () => void;
}

export type DialogsOverride = {};

export type DialogsOverwritten = DialogsOverride extends {
    dialogs: Record<string, React.FC<ContextDialogProps<any>>>;
}
    ? DialogsOverride
    : {
          dialogs: Record<string, React.FC<ContextDialogProps<any>>>;
      };

export type Dialogs = DialogsOverwritten['dialogs'];

export type Dialog = keyof Dialogs;

export const DialogsContext = React.createContext<DialogsContextProps>(null as any);
DialogsContext.displayName = 'DialogsContext';
