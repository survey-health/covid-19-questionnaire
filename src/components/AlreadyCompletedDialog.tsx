import { Grid, Hidden, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import React from 'react';
import { User } from '../App';
import makeStyles from '@material-ui/core/styles/makeStyles';

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

const useStyles = makeStyles(theme => ({
    dialogBody: {
        textAlign: 'center'
    },
    backdrop: {
        backgroundColor: '#C7192B',
        paddingBottom: '15px',
        color: 'white',
        fontWeight: 800,
    },
}));

type Props = {
    setUser: (user: User | null) => void;
};

export default function AlreadyCompletedDialog({ setUser }: Props) {
    const classes = useStyles();

    const handleClose = () => {
        setUser(null);
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
        <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }} disableTypography><Typography variant={'h6'} style={{ fontWeight: 700 }}>Warning</Typography></DialogTitle>
        <DialogContent style={{ overflow: "hidden" }}>
            <Grid container spacing={3}>
                <Grid item sm={2} xs={12} style={{ textAlign: 'center' }}>
                    <NotInterestedIcon style={{ height: '80px', width: '80px' }} />
                </Grid>
                <Grid item sm={8} xs={12} style={{ textAlign: 'center' }}>
                    <Typography style={{ textAlign: 'center' }}>You have already filled out a form for today.</Typography>
                </Grid>
                <Hidden xsDown >
                    <Grid item sm={2} xs={12} style={{ textAlign: 'center' }}>
                        <NotInterestedIcon style={{ height: '80px', width: '80px' }} />
                    </Grid>
                </Hidden>
            </Grid>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
            <MuiThemeProvider theme={theme}>
                <Button onClick={handleClose} disableRipple>Ok</Button>
            </MuiThemeProvider>
        </DialogActions>
    </Dialog>;
}