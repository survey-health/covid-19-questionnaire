import {Grid, Hidden, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import React, {ReactElement} from 'react';
import {User} from '../App';

const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                color: 'white',
                borderColor: 'white',
                border: '2px solid',
            }
        }
    }
})

const useStyles = makeStyles({
    dialogBody: {
        textAlign: 'center'
    },
    backdrop: {
        backgroundColor: '#C7192B',
        paddingBottom: '15px',
        color: 'white',
        fontWeight: 800,
    },
});

type Props = {
    open : boolean;
    setOpen : (open : boolean) => void;
    setUser : (user : User | null) => void;
    user : User;
};

const WarningDialog = ({user, open, setOpen, setUser} : Props) : ReactElement => {
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
        setUser(null);
    };

    const getErrorMessage = (user : User) => {
        const doNotAttend = <Typography style={{textAlign: "center"}}>
            Based on your responses, you <strong>should not</strong>{" "}
            attend school today.
        </Typography>
        if (user.type === "student") {
            return (
                <React.Fragment>
                    {doNotAttend}
                    <Typography style={{textAlign: "center"}}>
                        Please contact the school nurse's office.
                    </Typography>
                </React.Fragment>
            );
        }

        return <React.Fragment>
            {doNotAttend}
            <Typography style={{textAlign: "center"}}>
                Please contact your supervisor, and coordinate a substitute if needed.
            </Typography>
        </React.Fragment>;
    };

    return <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
            classes: {
                root: classes.backdrop,
            }
        }}
        maxWidth="md"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title" style={{textAlign: 'center', fontWeight: 700}} disableTypography>Warning</DialogTitle>
        <DialogContent style={{overflow: "hidden"}}>
            <Grid container spacing={3}>
                <Grid item sm={2} xs={12} style={{textAlign: 'center'}}>
                    <NotInterestedIcon style={{height: '80px', width: '80px'}}/>
                </Grid>
                <Grid item sm={8} xs={12} style={{textAlign: 'center'}}>
                    {getErrorMessage(user)}
                </Grid>
                <Hidden xsDown>
                    <Grid item sm={2} xs={12} style={{textAlign: 'center'}}>
                        <NotInterestedIcon style={{height: '80px', width: '80px'}}/>
                    </Grid>
                </Hidden>
            </Grid>
        </DialogContent>
        <DialogActions style={{justifyContent: 'center'}}>
            <MuiThemeProvider theme={theme}>
                <Button onClick={handleClose} disableRipple>Ok</Button>
            </MuiThemeProvider>
        </DialogActions>
    </Dialog>;
}

export default WarningDialog;
