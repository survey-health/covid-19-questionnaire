import { Button, Grid, Paper, Typography } from '@material-ui/core';
import {Question, User} from '../App';
import React, { useCallback, useState } from 'react';
import { apiEndpoint, apiFetch } from '../utils/api';

import CheckedInDialog from './CheckedInDialog';
import WarningDialog from './WarningDialog';
import makeStyles from '@material-ui/core/styles/makeStyles';
import QuestionYesNo from "./QuestionYesNo";
import QuestionNumber from "./QuestionNumber";

export const useStyles = makeStyles(theme => ({
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
        'white-space': 'pre-wrap',
    },
    questionSubText: {
        'white-space': 'pre-wrap',
    },
    errorText: {
        color: 'red',
    },
}));

export type Answer = {
    questionId: string;
    yes: boolean;
    type: string;
    number?: number;
}

const SELECT_TYPE = 'Multiple Values';
const NUMBER_TYPE = 'Number';

type Props = {
    user: User;
    userType: string;
    token: string;
    setUser: (user: User | null) => void;
    setSnackbarOpen: (snackbarOpen: boolean) => void;
    setSnackbarMessage: (snackbarMessage: string) => void;
    questions : Question[];
};

const GridQuestionnaire = ({ user, setUser, userType, setSnackbarOpen, setSnackbarMessage, token, questions}: Props) => {
    const classes = useStyles();

    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [showCheckedInDialog, setShowCheckedInDialog] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const setAnswerForQuestion = (answer: Answer) : void => {
        const inArray = answers.find((arrayAnswer, idx) => {
            if (arrayAnswer.questionId === answer.questionId) {
                answers[idx] = answer;
                setAnswers(answers);
                return true;
            }

            return false;
        });

        if (inArray === undefined) {
            setAnswers([
                ...answers,
                answer
            ]);
        }
    }

    const handleConfirm = () => {
        setShowErrorMessage(false);

        if (answers.length === questions.length) {
            updateQuestionnaire();

            let hasYes = answers.find((answer) => {
                return answer.yes
            });

            if (hasYes) {
                setShowWarningDialog(true);
            } else {
                setShowCheckedInDialog(true);
            }
        } else {
            setShowErrorMessage(true);
        }
    }

    const handleCancel = () => {
        setUser(null);
    }

    const updateQuestionnaire = useCallback(async () => {
        const url = new URL('/v1/' + userType + '/updateCurrentQuestionnaire/', apiEndpoint);

        const response = await apiFetch(url.href, {
            method: 'PUT',
            body: JSON.stringify({
                "answers": answers
            }),
        }, token)

        if (204 !== response.status) {
            setSnackbarOpen(true);
            setSnackbarMessage('There was an error processing your request.');
        }
    }, [answers, setSnackbarMessage, setSnackbarOpen, userType, token]);

    const questionOptions = questions.map((question) => {
        switch(question.type) {
            case NUMBER_TYPE:
                return <QuestionNumber key={question.id} question={question} setAnswerForQuestion={setAnswerForQuestion} />;
            default:
                return <QuestionYesNo key={question.id} question={question} setAnswerForQuestion={setAnswerForQuestion} />;
        }
    });

    return (
        <Paper variant="outlined" className={classes.paper}>
            <div style={{ textAlign: 'center' }}><img src={"/logos/SchoolLogo-" + user.schoolId + ".png"} className={classes.logo} alt="School or District Logo" /></div>
            <Typography variant={'h5'} className={classes.headerBold}>{user.name} ({user.id}) - {(new Date()).toLocaleDateString()}</Typography>
            <Typography variant={'h5'} className={classes.headerBold}>Have you experienced any of the following?</Typography>

            <Grid container spacing={3}>
                {questionOptions}
                {showErrorMessage && <Grid item xs={12}>
                    <Typography className={classes.errorText} variant={'h5'} align={'center'}>
                        Please answer all {questions.length} questions.
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
