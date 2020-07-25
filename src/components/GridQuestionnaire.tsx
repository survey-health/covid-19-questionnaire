import { Button, ButtonGroup, Grid, InputAdornment, Paper, TextField, Typography } from '@material-ui/core';
import { Questionnaire, User } from '../App';
import React, { useCallback, useState } from 'react';
import { apiEndpoint, apiFetch } from '../utils/api';

import CheckedInDialog from './CheckedInDialog';
import WarningDialog from './WarningDialog';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
    [theme.breakpoints.down('xs')]: {
        root: {
            fontSize: '0.65rem',
        },
    },
    logo: {
        maxHeight: '150px',
        maxWidth: '100%',
    },
    app: {
        position: 'absolute',
        top: '0px',
        bottom: '0px',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#615388',
        padding: '28px',
    },
    buttons: {
        textAlign: 'right',
    },
    buttonRow: {
        textAlign: 'center',
    },
    greyButtonNo: {
        backgroundColor: '#C2C2C2',
        color: 'white',
        borderColor: 'white',
        "&:hover": {
            background: "#469077"
        },
    },
    greyButtonYes: {
        backgroundColor: '#C2C2C2',
        color: 'white',
        borderColor: 'white',
        "&:hover": {
            background: "#CD0004"
        },
    },
    redButton: {
        backgroundColor: '#CD0004',
        color: 'white',
        borderColor: 'white',
    },
    greenButton: {
        backgroundColor: '#469077',
        color: 'white',
        borderColor: 'white',
    },
    paper: {
        marginTop: '32px',
        marginBottom: '32px',
        padding: '20px',
        width: '100%',
        backgroundColor: 'white',
    },
    cancelButton: {
        backgroundColor: '#888888',
        color: 'white',
        lineHeight: 2.5,
        paddingRight: '1.75em',
        paddingLeft: '1.5em',
    },
    confirmButton: {
        backgroundColor: '#468F76',
        color: 'white',
        marginLeft: '18px',
        lineHeight: 2.5,
        paddingRight: '1.75em',
        paddingLeft: '1.5em',
    },
    temperature: {
        marginBottom: '10px',
    },
    headerBold: {
        color: '#000',
        fontWeight: 700,
        textAlign: 'center',
        paddingBottom: '20px',
        marginBottom: '10px',
    },
    header: {
        color: '#00006E',
        textAlign: 'center',
        paddingBottom: '20px',
        fontWeight: 500,
        marginBottom: '10px',
    },
    questionText: {
        color: '#00006E',
    },
    errorText: {
        color: 'red',
    },
}));

type Props = {
    user: User;
    questionnaire: Questionnaire;
    userType: string;
    token: string;
    setUser: (user: User | null) => void;
    setSnackbarOpen: (snackbarOpen: boolean) => void;
    setSnackbarMessage: (snackbarMessage: string) => void;
};

const GridQuestionnaire = ({ user, setUser, questionnaire, userType, setSnackbarOpen, setSnackbarMessage, token }: Props) => {
    const classes = useStyles();

    const [question1, setQuestion1] = useState<boolean | null>(null);
    const [question2, setQuestion2] = useState<boolean | null>(null);
    const [question3, setQuestion3] = useState<boolean | null>(null);
    const [question4, setQuestion4] = useState<boolean | null>(null);
    const [question5, setQuestion5] = useState<boolean | null>(null);
    const [temperature, setTemperature] = useState<string>('');
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [showCheckedInDialog, setShowCheckedInDialog] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const handleConfirm = (event: React.MouseEvent) => {
        setShowErrorMessage(false);

        if (null !== question1 && null !== question2 && null !== question3 && null !== question4 && null !== question5 &&
            parseFloat(temperature!) >= 90 && parseFloat(temperature!) <= 110) {

            updateQuestionnaire(questionnaire);

            if (!question1 && !question2 && !question3 && !question4 && !question5 && parseFloat(temperature!) <= 100.4) {
                setShowCheckedInDialog(true)
            } else {
                setShowWarningDialog(true)
            }
        } else {
            setShowErrorMessage(true);
        }
    }

    const handleCancel = (event: React.MouseEvent) => {
        setUser(null);
    }

    const handleSetTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
        var rgx = /^[0-9]*\.?[0-9]*$/;
        var matchValue = event.target.value.match(rgx);

        setTemperature(null === matchValue ? '' : matchValue[0]);
    }

    const updateQuestionnaire = useCallback(async (questionnaire) => {
        const url = new URL('/v1/' + userType + '/updateCurrentQuestionnaire/', apiEndpoint);

        const response = await apiFetch(url.href, {
            method: 'PATCH',
            body: JSON.stringify({
                "Q01": question1 ? 'Yes' : 'No',
                "Q02": question2 ? 'Yes' : 'No',
                "Q03": question3 ? 'Yes' : 'No',
                "Q04": question4 ? 'Yes' : 'No',
                "Q05": question5 ? 'Yes' : 'No',
                "Q06": parseFloat(parseFloat(temperature).toFixed(2)),
            }),
        }, token)

        if (204 !== response.status) {
            setSnackbarOpen(true);
            setSnackbarMessage('There was an error processing your request.');
        }
    }, [question1, question2, question3, question4, question5, temperature, setSnackbarMessage, setSnackbarOpen, userType, token]);

    return (
        <Paper variant="outlined" className={classes.paper}>
            <div style={{ textAlign: 'center' }}><img src={"/logos/SchoolLogo-" + user.schoolId + ".png"} className={classes.logo} alt="School or District Logo" /></div>
            <Typography variant={'h5'} className={classes.headerBold}>{user.name} ({user.id}) - {(new Date()).toLocaleDateString()}</Typography>
            <Typography variant={'h5'} className={classes.headerBold}>Have you experienced any of the following?</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={9}>
                    <Typography className={classes.questionText} variant={'h5'} align={'left'}>1. Fever, Cough, Chills, and/or Muscle Aches?</Typography>
                </Grid>
                <Grid item xs={12} sm={3} className={classes.buttons}>
                    <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                        <Button className={classes.greyButtonNo + (false === question1 ? ' ' + classes.greenButton : '')} onClick={() => setQuestion1(false)}>No</Button>
                        <Button className={classes.greyButtonYes + (true === question1 ? ' ' + classes.redButton : '')} onClick={() => setQuestion1(true)}>Yes</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography className={classes.questionText} variant={'h5'} align={'left'}>2. Sore Throat, Runny Nose, and/or Loss of Taste or Smell?</Typography>
                </Grid>
                <Grid item xs={12} sm={3} className={classes.buttons}>
                    <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                        <Button className={classes.greyButtonNo + (false === question2 ? ' ' + classes.greenButton : '')} onClick={() => setQuestion2(false)}>No</Button>
                        <Button className={classes.greyButtonYes + (true === question2 ? ' ' + classes.redButton : '')} onClick={() => setQuestion2(true)}>Yes</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography className={classes.questionText} variant={'h5'} align={'left'}>3. Nausea, Vomiting, and/or Diarrhea?</Typography>
                </Grid>
                <Grid item xs={12} sm={3} className={classes.buttons}>
                    <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                        <Button className={classes.greyButtonNo + (false === question3 ? ' ' + classes.greenButton : '')} onClick={() => setQuestion3(false)}>No</Button>
                        <Button className={classes.greyButtonYes + (true === question3 ? ' ' + classes.redButton : '')} onClick={() => setQuestion3(true)}>Yes</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography className={classes.questionText} variant={'h5'} align={'left'}>4. Shortness of Breath, and/or Headache?</Typography>
                </Grid>
                <Grid item xs={12} sm={3} className={classes.buttons}>
                    <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                        <Button className={classes.greyButtonNo + (false === question4 ? ' ' + classes.greenButton : '')} onClick={() => setQuestion4(false)}>No</Button>
                        <Button className={classes.greyButtonYes + (true === question4 ? ' ' + classes.redButton : '')} onClick={() => setQuestion4(true)}>Yes</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography className={classes.questionText} variant={'h5'} align={'left'}>5. Close Contact or Cared for Someone with COVID-19?</Typography>
                </Grid>
                <Grid item xs={12} sm={3} className={classes.buttons}>
                    <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                        <Button className={classes.greyButtonNo + (false === question5 ? ' ' + classes.greenButton : '')} onClick={() => setQuestion5(false)}>No</Button>
                        <Button className={classes.greyButtonYes + (true === question5 ? ' ' + classes.redButton : '')} onClick={() => setQuestion5(true)}>Yes</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Typography className={classes.questionText} variant={'h5'} align={'left'}>6. Your temperature</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        id="temp"
                        label="Temperature"
                        variant="outlined"
                        className={classes.temperature}
                        value={temperature === null ? '' : temperature}
                        onChange={handleSetTemperature}
                        InputProps={{
                            endAdornment: <InputAdornment position={'end'}>&#730;F</InputAdornment>,
                            classes: {
                                adornedEnd: classes.adornedEnd,
                            }
                        }}
                    />
                </Grid>
                {showErrorMessage && <Grid item xs={12}>
                    <Typography className={classes.errorText} variant={'h5'} align={'center'}>
                        Please answer all five questions and enter your temperature (90 - 110).
                    </Typography>
                </Grid>}
                <Grid item xs={12} className={classes.buttonRow}>
                    <Button className={classes.cancelButton} variant="contained" disableElevation
                        onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className={classes.confirmButton} variant="contained" disableElevation
                        onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
            <WarningDialog user={user} open={showWarningDialog} setOpen={setShowWarningDialog} setUser={setUser} />
            <CheckedInDialog studentName={user.name} date={new Date()} open={showCheckedInDialog}
                setOpen={setShowCheckedInDialog} setUser={setUser} />
        </Paper>
    );
};

export default GridQuestionnaire;
