import {Button, Grid, Paper, Typography} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, {useCallback, useState, ReactElement} from 'react';
import {Trans} from 'react-i18next';
import {Question, User} from '../App';
import {apiEndpoint, apiFetch} from '../utils/api';
import i18n from '../utils/I18n';
import ChangeLanguage from "./ChangeLanguage";
import CheckedInDialog from './CheckedInDialog';
import QuestionNumber from "./QuestionNumber";
import QuestionYesNo from "./QuestionYesNo";
import WarningDialog from './WarningDialog';

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
    paper: {
        marginTop: '32px',
        marginBottom: '32px',
        padding: '20px',
        width: '100%',
        backgroundColor: 'white',
    },
    cancelButton: {
        backgroundColor: process.env.REACT_APP_THEME_CANCEL_BUTTON_COLOR,
        color: 'white',
        lineHeight: 2.5,
        paddingRight: '1.75em',
        paddingLeft: '1.5em',
    },
    confirmButton: {
        backgroundColor: process.env.REACT_APP_THEME_BACKGROUND_COLOR,
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
    questionId : string;
    yes : boolean;
    type : string;
    number ?: number;
}

const NUMBER_TYPE = 'Number';

type Props = {
    user : User;
    userType : string;
    token : string;
    setUser : (user : User | null) => void;
    setSnackbarOpen : (snackbarOpen : boolean) => void;
    setSnackbarMessage : (snackbarMessage : string) => void;
    questions : Question[];
    studentListMode : boolean;
    updateStudentStatus : (student : User, status : string) => void;
    onLanguageChange : (lang : string) => void;
};

const GridQuestionnaire = (
    {
        user,
        setUser,
        userType,
        setSnackbarOpen,
        setSnackbarMessage,
        token,
        questions,
        studentListMode,
        updateStudentStatus,
        onLanguageChange
    } : Props) : ReactElement => {
    const classes = useStyles();

    const [answers, setAnswers] = useState<Answer[]>([]);
    const [showWarningDialog, setShowWarningDialog] = useState(false);
    const [showCheckedInDialog, setShowCheckedInDialog] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const setAnswerForQuestion = (answer : Answer) : void => {
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

    const removeQuestionAnswer = (questionId : string) : void => {
        setAnswers(
            answers.filter((a : Answer) => {
                return a.questionId !== questionId
            })
        );
    }

    const handleConfirm = () => {
        setShowErrorMessage(false);

        if (answers.length === questions.length) {
            updateQuestionnaire(studentListMode ? user.id : '');

            const hasYes = answers.find((answer) => {
                return answer.yes
            });

            if (hasYes) {
                setShowWarningDialog(true);
            } else {
                setShowCheckedInDialog(true);
            }

            if (studentListMode) {
                updateStudentStatus(
                    user,
                    (hasYes ? i18n.t('common.denied', 'Denied') : i18n.t('common.approved', 'Approved'))
                );
            }
        } else {
            setShowErrorMessage(true);
        }
    }

    const handleCancel = () => {
        setUser(null);
    }

    const updateQuestionnaire = useCallback(async (studentId ?: string) => {
        const url = new URL('/v1/' + userType + '/update-current-questionnaire' + (studentId ? `/${studentId}` : ''), apiEndpoint);

        const response = await apiFetch(url.href, {
            method: 'PUT',
            body: JSON.stringify({
                "answers": answers
            }),
        }, token)

        if (response.status !== 204) {
            setSnackbarOpen(true);
            setSnackbarMessage(
                i18n.t(
                    'gridQuestionnaire.errorProcessingRequest',
                    'There was an error processing your request.'
                )
            );
        }
    }, [answers, setSnackbarMessage, setSnackbarOpen, userType, token]);

    const questionOptions = questions.map((question) => {
        switch(question.type) {
        case NUMBER_TYPE:
            return <QuestionNumber key={question.id} question={question} setAnswerForQuestion={setAnswerForQuestion}
                removeQuestionAnswer={removeQuestionAnswer}/>;
        default:
            return <QuestionYesNo key={question.id} question={question} setAnswerForQuestion={setAnswerForQuestion}/>;
        }
    });

    return (
        <Paper variant="outlined" className={classes.paper}>
            <div style={{textAlign: 'center'}}>
                <img
                    src={"/logos/SchoolLogo-" + user.schoolId + ".png"}
                    className={classes.logo}
                    alt={i18n.t('common.schoolOrDistrictLogo', 'School or District Logo')}
                />
            </div>
            <Typography variant={'h5'} className={classes.headerBold}>{user.name} ({user.id}) - {(new Date()).toLocaleDateString()}</Typography>
            {!studentListMode && <Typography variant={'h5'} className={classes.headerBold}>
                <Trans i18nKey="gridQuestionnaire.haveYouExperienced">
                    Have you experienced any of the following?
                </Trans>
            </Typography>}
            {studentListMode && <Typography variant={'h5'} className={classes.headerBold}>
                <Trans i18nKey="gridQuestionnaire.hasYourChildExperienced">
                    Has your child experienced any of the following?
                </Trans>
            </Typography>}

            <Grid container spacing={3}>
                {questionOptions}
                {showErrorMessage && <Grid item xs={12}>
                    <Typography className={classes.errorText} variant={'h5'} align={'center'}>
                        <Trans i18nKey="gridQuestionnaire.pleaseAnswerQuestions" count={questions.length}>
                            Please answer all {questions.length} questions.
                        </Trans>
                    </Typography>
                </Grid>}
                <Grid item xs={12} className={classes.buttonRow}>
                    <Button className={classes.cancelButton} variant="contained" disableElevation
                        onClick={handleCancel}>
                        <Trans i18nKey="common.cancel">
                            Cancel
                        </Trans>
                    </Button>
                    <Button className={classes.confirmButton} variant="contained" disableElevation
                        onClick={handleConfirm}>
                        <Trans i18nKey="common.confirm">
                            Confirm
                        </Trans>
                    </Button>
                </Grid>
            </Grid>
            <ChangeLanguage onChange={onLanguageChange}/>
            <WarningDialog user={user} open={showWarningDialog} setOpen={setShowWarningDialog} setUser={setUser}/>
            <CheckedInDialog open={showCheckedInDialog}
                setOpen={setShowCheckedInDialog} setUser={setUser}/>
        </Paper>
    );
};

export default GridQuestionnaire;
