import { DialogState } from './context';

interface DialogsState {
    dialogs: DialogState[];

    /**
     * Dialog that is currently open or was the last open one.
     * Keeping the last one is necessary for providing a clean exit transition.
     */
    current: DialogState | null;
}

interface OpenAction {
    type: 'OPEN';
    dialog: DialogState;
}

interface CloseAction {
    type: 'CLOSE';
    dialogId: string;
    canceled?: boolean;
}

interface CloseAllAction {
    type: 'CLOSE_ALL';
    canceled?: boolean;
}

function handleCloseDialog(dialog: DialogState, canceled?: boolean) {
    if (canceled && dialog.type === 'confirm') {
        dialog.props.onCancel?.();
    }

    dialog.props.onClose?.({}, 'backdropClick');
}

export function dialogsReducer(state: DialogsState, action: OpenAction | CloseAction | CloseAllAction): DialogsState {
    switch (action.type) {
        case 'OPEN': {
            return {
                current: action.dialog,
                dialogs: [...state.dialogs, action.dialog],
            };
        }
        case 'CLOSE': {
            const dialog = state.dialogs.find((m) => m.id === action.dialogId);
            if (!dialog) {
                return state;
            }

            handleCloseDialog(dialog, action.canceled);

            const remainingDialogs = state.dialogs.filter((m) => m.id !== action.dialogId);

            return {
                current: remainingDialogs[remainingDialogs.length - 1] || state.current,
                dialogs: remainingDialogs,
            };
        }
        case 'CLOSE_ALL': {
            if (!state.dialogs.length) {
                return state;
            }

            // Resolve dialog stack from top to bottom
            state.dialogs
                .concat()
                .reverse()
                .forEach((dialog) => {
                    handleCloseDialog(dialog, action.canceled);
                });

            return {
                current: state.current,
                dialogs: [],
            };
        }
        default: {
            return state;
        }
    }
}
