import React from 'react';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InfoIcon from '@material-ui/icons/Info';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

type Props = {
  notificationCloseAction: Function,
  notification: Notification,
};

type Notification = {
  autoHideDuration?: number,
  isOpen: boolean,
  message: React.ReactNode,
  type: "error" | "info" | "success",
};

const AUTO_HIDE_DURATION = 15000;

export const SnackbarNotifier = (props: Props) => {
  // const [open, setOpen] = React.useState(false);
  const { notification, notificationCloseAction } = props;
  const { autoHideDuration, isOpen, message, type } = notification;

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    notificationCloseAction();
    // setOpen(false);
  };

  const renderIcon: () => {} = (): any => {
    switch (type) {
      case 'error':
        return <HighlightOffIcon fontSize="small" />;
      case 'info':
      default:
        return <InfoIcon fontSize="small" />;
      case 'success':
        return <CheckCircleOutlineIcon fontSize="small" />;
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isOpen}
        {...(autoHideDuration ? {autoHideDuration : autoHideDuration} : {autoHideDuration : AUTO_HIDE_DURATION})}
        onClose={handleClose}
        message={message}
        action={
          <>
            {/*
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            */}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              {renderIcon()}
            </IconButton>
          </>
        }
      />
    </div>
  );
};
