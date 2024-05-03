import React, { useCallback, useReducer, useRef } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { ContentDialog } from './ContentDialog';
import { Dialogs } from './Dialogs';
import {
    ActionLabels,
    ContextDialogProps,
    DialogSettings,
    DialogsContext,
    DialogsContextProps,
    OpenConfirmDialog,
    OpenContentDialog,
    OpenContextDialog,
} from './context';
import { useDialogsEvents } from './events';
import { dialogsReducer } from './reducer';
import { getDefaultZIndex } from './utils/get-default-z-index';
import { randomId } from './utils/random-id';

export interface DialogsProviderProps {
    /** Your app */
    children?: React.ReactNode;

    /** Predefined dialogs */
    dialogs?: Record<string, React.FC<ContextDialogProps<any>>>;

    /** Shared Dialog component props, applied for every dialog */
    dialogProps?: DialogSettings;

    /** actions dialog labels */
    labels?: ActionLabels;
}

function separateDialogProps(props: OpenConfirmDialog & OpenContentDialog) {
    if (!props) {
        return { confirmProps: {}, contentProps: {}, dialogProps: {} };
    }

    const {
        id,
        children,
        onCancel,
        onConfirm,
        closeOnConfirm,
        closeOnCancel,
        closeProps,
        cancelProps,
        confirmProps,
        actionsProps,
        labels,
        withCloseButton,
        ...others
    } = props;

    return {
        confirmProps: {
            id,
            children,
            onCancel,
            onConfirm,
            closeOnConfirm,
            closeOnCancel,
            cancelProps,
            confirmProps,
            actionsProps,
            labels,
        },
        contentProps: {
            id,
            children,
            closeProps,
            actionsProps,
            withCloseButton,
            labels,
        },
        dialogProps: {
            id,
            ...others,
        },
    };
}

export function DialogsProvider({ children, dialogProps, labels, dialogs }: DialogsProviderProps) {
    const [state, dispatch] = useReducer(dialogsReducer, { dialogs: [], current: null });
    const stateRef = useRef(state);
    stateRef.current = state;

    const closeAll = useCallback(
        (canceled?: boolean) => {
            dispatch({ type: 'CLOSE_ALL', canceled });
        },
        [stateRef, dispatch],
    );

    const openDialog = useCallback(
        ({ dialogId, ...props }: OpenContentDialog) => {
            const id = dialogId || randomId();

            dispatch({
                type: 'OPEN',
                dialog: {
                    id,
                    type: 'content',
                    props,
                },
            });
            return id;
        },
        [dispatch],
    );

    const openConfirmDialog = useCallback(
        ({ dialogId, ...props }: OpenConfirmDialog) => {
            const id = dialogId || randomId();
            dispatch({
                type: 'OPEN',
                dialog: {
                    id,
                    type: 'confirm',
                    props,
                },
            });
            return id;
        },
        [dispatch],
    );

    const openContextDialog = useCallback(
        (dialog: string, { dialogId, ...props }: OpenContextDialog) => {
            const id = dialogId || randomId();
            dispatch({
                type: 'OPEN',
                dialog: {
                    id,
                    type: 'context',
                    props,
                    ctx: dialog,
                },
            });
            return id;
        },
        [dispatch],
    );

    const closeDialog = useCallback(
        (id: string, canceled?: boolean) => {
            dispatch({ type: 'CLOSE', dialogId: id, canceled });
        },
        [stateRef, dispatch],
    );

    useDialogsEvents({
        openDialog,
        openConfirmDialog,
        openContextDialog: ({ dialog, ...payload }: any) => openContextDialog(dialog, payload),
        closeDialog,
        closeContextDialog: closeDialog,
        closeAllDialogs: closeAll,
    });

    const ctx: DialogsContextProps = {
        dialogs: state.dialogs,
        openDialog,
        openConfirmDialog,
        openContextDialog,
        closeDialog,
        closeContextDialog: closeDialog,
        closeAll,
    };

    const getCurrentDialog = () => {
        const currentDialog = stateRef.current.current;
        switch (currentDialog?.type) {
            case 'context': {
                const { innerProps, ...rest } = currentDialog.props;
                const ContextDialog = dialogs![currentDialog.ctx];

                return {
                    dialogProps: rest,
                    content: <ContextDialog innerProps={innerProps} context={ctx} id={currentDialog.id} />,
                };
            }
            case 'confirm': {
                const { dialogProps: separatedDialogProps, confirmProps: separatedConfirmProps } = separateDialogProps(
                    currentDialog.props,
                );

                return {
                    dialogProps: separatedDialogProps,
                    content: (
                        <ConfirmDialog
                            {...separatedConfirmProps}
                            id={currentDialog.id}
                            labels={currentDialog.props.labels || labels}
                        />
                    ),
                };
            }
            case 'content': {
                const { dialogProps: separatedDialogProps, contentProps: separatedContentProps } = separateDialogProps(
                    currentDialog.props,
                );

                return {
                    dialogProps: separatedDialogProps,
                    content: (
                        <ContentDialog
                            {...separatedContentProps}
                            id={currentDialog.id}
                            labels={currentDialog.props.labels || labels}
                        />
                    ),
                };
            }
            default: {
                return {
                    dialogProps: {},
                    content: null,
                };
            }
        }
    };

    const { dialogProps: currentDialogProps, content } = getCurrentDialog();

    return (
        <DialogsContext.Provider value={ctx}>
            <Dialogs
                sx={{ zIndex: getDefaultZIndex('dialog') + 1 }}
                {...dialogProps}
                {...currentDialogProps}
                open={state.dialogs.length > 0}
                onClose={() => closeDialog(state.current?.id as any)}
            >
                {content}
            </Dialogs>
            {children}
        </DialogsContext.Provider>
    );
}
