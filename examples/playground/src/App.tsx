import {
    Button,
    Container,
    CssBaseline,
    DialogActions,
    DialogContent,
    DialogContentText,
    Stack,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { ContextDialogProps, DialogsProvider, dialogs } from 'mui-x-dialogs';

function App() {
    const theme = createTheme();

    const handleConfirm = () => {
        dialogs.confirm({
            title: 'Confirm',
            children: 'This action cannot be undone.',
            onCancel: () => {
                console.log('Canceled');
            },
            onConfirm: () => {
                console.log('Confirmed');
            },
        });
    };

    const handleAlert = () => {
        dialogs.open({
            withCloseButton: true,
            title: 'Alert',
            children: 'This action cannot be undone.',
        });
    };

    const handleDemo = () => {
        dialogs.context({
            dialog: 'demonstration',
            title: 'Test modal from context',
            innerProps: {
                description:
                    'This modal was defined in ModalsProvider, you can open it anywhere in you app with useModals hook',
            },
        });
    };

    const TestModal = ({ id, context, innerProps }: ContextDialogProps<{ description: string }>) => {
        return (
            <>
                <DialogContent>
                    <DialogContentText>{innerProps.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => context.closeDialog(id)}>Close</Button>
                </DialogActions>
            </>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <DialogsProvider dialogs={{ demonstration: TestModal }}>
                <Stack height="100vh" justifyContent="center" textAlign="center">
                    <Container>
                        <Button onClick={handleConfirm}>Confirm</Button>
                        <Button onClick={handleAlert}>Alert</Button>
                        <Button onClick={handleDemo}>Demo</Button>
                    </Container>
                </Stack>
            </DialogsProvider>
        </ThemeProvider>
    );
}

export default App;
