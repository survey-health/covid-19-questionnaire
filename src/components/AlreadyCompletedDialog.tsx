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
import {User, Questionnaire} from '../App';

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
    setUser : (user : User | null) => void;
    setStudent : (student : User | null) => void;
    setQuestionnaire : (questionnaire : Questionnaire | null) => void;
    studentListMode : boolean;
};

const AlreadyCompletedDialog = ({setUser, studentListMode, setQuestionnaire, setStudent} : Props) : ReactElement => {
    const classes = useStyles();

    const handleClose = () => {
        if (studentListMode) {
            setQuestionnaire(null);
            setStudent(null);
        } else {
            setUser(null);
        }
    };

    return <Dialog
        open={true}
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
        <DialogTitle id="alert-dialog-title" style={{textAlign: 'center'}} disableTypography><Typography variant={'h6'} style={{fontWeight: 700}}>Warning</Typography></DialogTitle>
        <DialogContent style={{overflow: "hidden"}}>
            <Grid container spacing={3}>
                <Grid item sm={2} xs={12} style={{textAlign: 'center'}}>
                    <NotInterestedIcon style={{height: '80px', width: '80px'}}/>
                </Grid>
                <Grid item sm={8} xs={12} style={{textAlign: 'center'}}>
                    <Typography style={{textAlign: 'center'}}>You have already filled out a form for today.</Typography>
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

export default AlreadyCompletedDialog;
