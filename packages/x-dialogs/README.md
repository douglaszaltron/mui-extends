
# Dialogs manager

Centralized dialogs manager with option to handle state of multi-step dialogs

## Installation

```
npm install mui-x-dialogs
```

### Wrap your app with DialogsProvider component:

```jsx
import { ThemeProvider } from '@mui/material';
import { DialogsProvider } from 'mui-x-dialogs';

function Demo() {
  return (
    <ThemeProvider>
      <DialogsProvider>{/* Your app here */}</DialogsProvider>
    </ThemeProvider>
  );
}
```

### Confirm dialog

Package includes special dialog that can be used for confirmations. Component includes confirm and cancel buttons and supports children to display additional information about action. Use `confirm` function to open a confirm dialog:

```jsx
import { Button, Typography } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  const openDialog = () => dialogs.confirm({
    title: 'Please confirm your action',
    children: (
      <Typography>
        This action is so important that you are required to confirm it with a dialog. Please click
        one of these buttons to proceed.
      </Typography>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });

  return <Button onClick={openDialog}>Open confirm dialog</Button>;
}
```

`confirm` function accepts one argument with following properties:

- `dialogId` – dialog id, defaults to random id, can be used to close dialog programmatically
- `children` – additional dialog content displayed before actions
- `onCancel` – called when cancel button is clicked
- `onConfirm` – called when confirm button is clicked
- `closeOnConfirm` – should dialog be closed when confirm button is clicked, defaults to `true`
- `closeOnCancel` – should dialog be closed when cancel button is clicked, defaults to `true`
- `cancelProps` – cancel button props
- `confirmProps` – confirm button props
- `actionsProps` – buttons `DialogActions` props
- `labels` – close, cancel and confirm buttons labels, can be defined on DialogsProvider

Using this properties you can customize confirm dialog to match current context requirements:

```jsx
import { Button, Typography } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  const openDeleteDialog = () =>
    dialogs.confirm({
      title: 'Delete your profile',
      maxWidth: 'lg',
      children: (
        <Typography>
          Are you sure you want to delete your profile? This action is destructive and you will have
          to contact support to restore your data.
        </Typography>
      ),
      labels: { confirm: 'Delete account', cancel: "No don't delete it" },
      confirmProps: { color: 'error' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    });

  return <Button onClick={openDeleteDialog} color="red">Delete account</Button>;
}
```

To setup shared labels for confirm dialogs set `labels` on `DialogsProvider`:

```jsx
import { DialogsProvider } from 'mui-x-dialogs';

function Demo() {
  return (
    <DialogsProvider labels={{ confirm: 'Submit', cancel: 'Cancel' }}>
      {/* Your app here */}
    </DialogsProvider>
  );
}
```

### Context dialogs

You can define any amount of dialogs in DialogsProvider context:

```jsx
import { Button, Typography } from '@mui/material';
import { ContextDialogProps, DialogsProvider } from 'mui-x-dialogs';

const TestDialog = ({
  context,
  id,
  innerProps,
}: ContextDialogProps<{ dialogBody: string }>) => (
  <>
    <Typography>{innerProps.dialogBody}</Typography>
    <Button fullWidth onClick={() => context.closeDialog(id)}>
      Close dialog
    </Button>
  </>
);

function Demo() {
  return (
    <DialogsProvider
      dialogs={{ demonstration: TestDialog /* ...other dialogs */ }}
    >
      {/* Your app here */}
    </DialogsProvider>
  );
}
```

And then open one of these dialogs with `dialogs.context` function. `dialogs.context` function accepts 2 arguments: dialog key (should match one defined on DialogsProvider) and dialog props:

```jsx
import { Button } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  return (
    <Button
      onClick={() =>
        dialogs.context({
          dialog: 'demonstration',
          title: 'Test dialog from context',
          innerProps: {
            dialogBody:
              'This dialog was defined in DialogsProvider, you can open it anywhere in you app with useDialogs hook',
          },
        })
      }
    >
      Open demonstration context dialog
    </Button>
  );
}
```

### Typesafe context dialogs

By default `innerProps` and `dialog` are not typesafe. You can add typesafety with a Typescript module declaration.

```jsx
const TestDialog = ({
  context,
  id,
  innerProps,
}: ContextDialogProps<{ dialogBody: string }>) => (
  <>
    <Typography>{innerProps.dialogBody}</Typography>
    <Button fullWidth onClick={() => context.closeDialog(id)}>
      Close dialog
    </Button>
  </>
);
const dialogs = {
  demonstration: TestDialog,
  /* ...other dialogs */
};
declare module 'mui-x-dialogs' {
  export interface DialogsOverride {
    dialogs: typeof dialogs;
  }
}
function Demo() {
  return (
    <DialogsProvider dialogs={dialogs}>
      {/* Your app here */}
    </DialogsProvider>
  );
}
```

Typesafe context dialogs will force you to use the correct types for `openContextDialog`:

```jsx
import { closeDialog, openContextDialog } from 'mui-x-dialogs';

openContextDialog({
  dialog: 'demonstration',
  title: 'Test dialog from context',
  innerProps: {
    dialogBody:
      'This dialog was defined in DialogsProvider, you can open it anywhere in you app with useDialogs hook',
  },
});

closeDialog('demonstration');
```

### Content dialogs
With dialogs.open function you can open a dialog with any content:

```jsx
import { TextField, Button } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  return (
    <Button
      onClick={() => {
        dialogs.open({
          title: 'Subscribe to newsletter',
          children: (
            <>
              <TextField label="Your email" placeholder="Your email" autoFocus />
              <Button fullWidth onClick={() => dialogs.closeAll()} mt="md">
                Submit
              </Button>
            </>
          ),
        });
      }}
    >
      Open content dialog
    </Button>
  );
}
```

`open` function accepts one argument with following properties:

- `dialogId` – dialog id, defaults to random id, can be used to close dialog programmatically
- `children` – additional dialog content displayed before actions
- `closeProps` – close button props
- `actionsProps` – buttons `DialogActions` props
- `labels` – close buttons labels, can be defined on DialogsProvider
- `withCloseButton` – without button, press escape or click on overlay to close

Using this properties you can customize confirm dialog to match current context requirements:

```jsx
import { TextField, Button } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  return (
    <Button
      onClick={() => {
        dialogs.open({
          title: 'Alert!',
          withCloseButton: true,
          children: 'This is an important alert message. Please take note.';
          labels: { close: 'Ok' }
      }}
    >
      Open content dialog
    </Button>
  );
}
```

### Multiple opened dialogs

You can open multiple layers of dialogs. Every opened dialog is added as first element in dialogs queue. To close all opened dialogs call `dialogs.closeAll()` function:

```jsx
import { Button, Typography } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  return (
    <Button
      onClick={() =>
        dialogs.confirm({
          title: 'Please confirm your action',
          closeOnConfirm: false,
          labels: { confirm: 'Next dialog', cancel: 'Close dialog' },
          children: (
            <Typography>
              This action is so important that you are required to confirm it with a dialog. Please
              click one of these buttons to proceed.
            </Typography>
          ),
          onConfirm: () =>
            dialogs.confirm({
              title: 'This is dialog at second layer',
              labels: { confirm: 'Close dialog', cancel: 'Back' },
              closeOnConfirm: false,
              children: (
                <Typography>
                  When this dialog is closed dialogs state will revert to first dialog
                </Typography>
              ),
              onConfirm: dialogs.closeAll,
            }),
        })
      }
    >
      Open multiple steps dialog
    </Button>
  );
}
```

### Dialog props

You can pass props down to the `Dialog` component by adding them to the argument of every `dialogs.x` function. Example of setting `maxWidth`, `fullWidth` and `scroll` props:

```jsx
import { Button, Typography } from '@mui/material';
import { dialogs } from 'mui-x-dialogs';

function Demo() {
  const openDialog = () => dialogs.confirm({
    title: 'Please confirm your action',
    maxWidth: 'sm',
    fullWidth: true,
    scroll: 'body',
    children: (
      <Typography>
        This action is so important that you are required to confirm it with a dialog. Please click
        one of these buttons to proceed.
      </Typography>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });

  return <Button onClick={openDialog}>Open confirm dialog</Button>;
}
```

### Dynamic Content and the dialogs manager
Note that when using the Dialogs manager, dynamic content is not supported. Once dialog is opened, a snapshot is saved into internal state and cannot be updated.

If you intend to have dynamic content in dialogs, either:

- Use internal component state, or
- Use the dialog component instead of dialogs manager

## Acknowledgement

We would like to thank the [Mantine](https://mantine.dev/x/modals/) project for serving as a foundation and inspiration for building this package. Much of the code and ideas originated from this project.
