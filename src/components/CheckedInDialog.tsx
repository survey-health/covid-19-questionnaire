import {Grid, Hidden, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React, {ReactElement} from 'react';
import {Trans} from 'react-i18next';
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
        backgroundColor: '#56A626',
        paddingBottom: '15px',
        color: 'white',
        fontWeight: 800,
    },
});

type Props = {
    open : boolean;
    setOpen : (open : boolean) => void;
    setUser : (user : User | null) => void;
};

const CheckedInDialog = ({open, setOpen, setUser} : Props) : ReactElement => {
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
        setUser(null);
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
        <DialogTitle id="alert-dialog-title" style={{textAlign: 'center'}} disableTypography>
            <Typography variant={'h6'} style={{fontWeight: 700}}>
                <Trans i18nKey="checkedIn.title">
                    Check In Confirmed
                </Trans>
            </Typography>
        </DialogTitle>
        <DialogContent style={{overflow: "hidden"}}>
            <Grid container spacing={3}>
                <Grid item sm={2} xs={12} style={{textAlign: 'center'}}>
                    <CheckCircleIcon style={{height: '80px', width: '80px'}}/>
                </Grid>
                <Grid item sm={8} xs={12} style={{textAlign: 'center'}}>
                    <Typography style={{textAlign: 'center'}}>
                        <Trans i18nKey="alreadyCompleted.title">
                            <Trans i18nKey="checkedIn.thankYou">
                                Thank you for completing the health questionnaire.
                            </Trans>
                        </Trans>
                        <br/>
                    </Typography>
                    <Typography style={{textAlign: 'center'}}>
                        <Trans i18nKey="checkedIn.lookingForward">
                            We look forward to seeing you at school today!
                        </Trans>
                    </Typography>
                </Grid>
                <Hidden xsDown>
                    <Grid item sm={2} xs={12} style={{textAlign: 'center'}}>
                        <CheckCircleIcon style={{height: '80px', width: '80px'}}/>
                    </Grid>
                </Hidden>
            </Grid>
        </DialogContent>
        <DialogActions style={{justifyContent: 'center'}}>
            <MuiThemeProvider theme={theme}>
                <Button onClick={handleClose} disableRipple>
                    <Trans i18nKey="common.ok">
                        Ok
                    </Trans>
                </Button>
            </MuiThemeProvider>
        </DialogActions>
    </Dialog>;
}

export default CheckedInDialog;
