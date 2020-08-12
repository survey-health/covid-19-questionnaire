import Snackbar from '@material-ui/core/Snackbar';
import {Theme, makeStyles} from '@material-ui/core/styles';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import React, {ReactElement} from 'react';

const Alert = (props : AlertProps) : ReactElement => {
    return <MuiAlert elevation={6} variant="filled" {...props}/>;
}

const useStyles = makeStyles((theme : Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

type Props = {
  open : boolean;
  message : string;
  severity : "success" | "info" | "warning" | "error" | undefined;
  setOpen : (open : boolean) => void;
};

const Snackbars = ({open, setOpen, message, severity} : Props) : ReactElement => {
    const classes = useStyles();

    const handleClose = (event ?: React.SyntheticEvent, reason ?: string) => {
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

export default Snackbars;
