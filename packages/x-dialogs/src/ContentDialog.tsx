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

export interface ContentDialogProps {
    id?: string;
    children?: React.ReactNode;
    closeProps?: ButtonProps & React.ComponentPropsWithoutRef<'button'>;
    actionsProps?: DialogActionsProps;
    withCloseButton?: boolean;
    labels?: ActionLabels;
}

export function ContentDialog({
    id,
    closeProps,
    labels = { close: 'Close' },
    actionsProps,
    children,
    withCloseButton = false,
}: ContentDialogProps) {
    const { close: closeLabel } = labels;
    const ctx = useDialogs();

    const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
        typeof closeProps?.onClick === 'function' && closeProps?.onClick(event);
        ctx.closeDialog(id!);
    };

    if (typeof children === 'string') {
        children = <DialogContentText>{children}</DialogContentText>;
    }

    return (
        <>
            {children && <DialogContent>{children}</DialogContent>}

            {!!withCloseButton && (
                <DialogActions {...actionsProps}>
                    <Button variant="text" {...closeProps} onClick={handleCancel}>
                        {closeProps?.children || closeLabel}
                    </Button>
                </DialogActions>
            )}
        </>
    );
}
