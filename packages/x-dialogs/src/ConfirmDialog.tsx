import {
    Button,
    ButtonProps,
    DialogActions,
    DialogActionsProps,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import React from 'react';
import { ActionLabels } from './context';
import { useDialogs } from './use-dialogs/use-dialogs';

export interface ConfirmDialogProps {
    id?: string;
    children?: React.ReactNode;
    onCancel?: () => void;
    onConfirm?: () => void;
    closeOnConfirm?: boolean;
    closeOnCancel?: boolean;
    cancelProps?: ButtonProps & React.ComponentPropsWithoutRef<'button'>;
    confirmProps?: ButtonProps & React.ComponentPropsWithoutRef<'button'>;
    actionsProps?: DialogActionsProps;
    labels?: ActionLabels;
}

export function ConfirmDialog({
    id,
    cancelProps,
    confirmProps,
    labels = { cancel: 'Cancel', confirm: 'Confirm' },
    closeOnConfirm = true,
    closeOnCancel = true,
    actionsProps,
    onCancel,
    onConfirm,
    children,
}: ConfirmDialogProps) {
    const { cancel: cancelLabel, confirm: confirmLabel } = labels;
    const ctx = useDialogs();

    const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
        typeof cancelProps?.onClick === 'function' && cancelProps?.onClick(event);
        typeof onCancel === 'function' && onCancel();
        closeOnCancel && ctx.closeDialog(id!);
    };

    const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
        typeof confirmProps?.onClick === 'function' && confirmProps?.onClick(event);
        typeof onConfirm === 'function' && onConfirm();
        closeOnConfirm && ctx.closeDialog(id!);
    };

    if (typeof children === 'string') {
        children = <DialogContentText>{children}</DialogContentText>;
    }

    return (
        <>
            {children && <DialogContent>{children}</DialogContent>}

            <DialogActions {...actionsProps}>
                <Button variant="text" {...cancelProps} onClick={handleCancel}>
                    {cancelProps?.children || cancelLabel}
                </Button>

                <Button variant="contained" {...confirmProps} onClick={handleConfirm}>
                    {confirmProps?.children || confirmLabel}
                </Button>
            </DialogActions>
        </>
    );
}
