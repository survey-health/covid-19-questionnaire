import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Theme, makeStyles } from '@material-ui/core/styles';

import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

type Props = {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
  setOpen: (open: boolean) => void;
};

export default function Snackbars({ open, setOpen, message, severity }: Props) {
  const classes = useStyles();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}