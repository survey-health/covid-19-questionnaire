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
            <Trans i18nKey="warning.doNotAttend">
                Based on your responses, your child/you <strong>should not</strong>{" "} attend school today.
            </Trans>
        </Typography>
        if (user.type === "student") {
            return (
                <React.Fragment>
                    {doNotAttend}
                    <Typography style={{textAlign: "center"}}>
                        <Trans i18nKey="warning.pleaseContactSchoolNurseOffice">
                            Please inform your school’s nurse and enter the illness absence into Infinite Campus.
                        </Trans>
                    </Typography>
                </React.Fragment>
            );
        }

        return <React.Fragment>
            {doNotAttend}
            <Typography style={{textAlign: "center"}}>
                <Trans i18nKey="warning.pleaseContactSupervisor">
                    Please inform your supervisor immediately and reach out to HR to determine next steps at 224-242-0456 or chedges@barrington220.org.
                </Trans>
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
        <DialogTitle id="alert-dialog-title" style={{textAlign: 'center', fontWeight: 700}} disableTypography>
            <Trans i18nKey="warning.title">
                Warning
            </Trans>
        </DialogTitle>
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
                <Button onClick={handleClose} disableRipple>
                    <Trans i18nKey="common.ok">
                        Ok
                    </Trans>
                </Button>
            </MuiThemeProvider>
        </DialogActions>
    </Dialog>;
}

export default WarningDialog;
