import { Dialog, DialogProps, DialogTitle, DialogTitleProps } from '@mui/material';

export interface DialogsProps {
    title?: React.ReactNode;
    titleProps?: DialogTitleProps;
    withCloseButton?: boolean;
}

export function Dialogs({ title, titleProps, children, ...rest }: DialogsProps & DialogProps) {
    return (
        <Dialog {...rest}>
            {!!title && <DialogTitle {...titleProps}>{title}</DialogTitle>}
            {children && <>{children}</>}
        </Dialog>
    );
}
