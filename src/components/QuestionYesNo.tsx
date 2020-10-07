import {Grid, Typography, Button, ButtonGroup} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, {useState, ReactElement} from 'react';
import {Trans} from 'react-i18next';
import {Question} from '../App';
import {Answer} from './GridQuestionnaire';

const useStyles = makeStyles(({
    questionText: {
        color: process.env.REACT_APP_THEME_QUESTION_TEXT_COLOR,
    },
    questionSubText: {
        color: process.env.REACT_APP_THEME_QUESTION_TEXT_COLOR,
    },
    buttons: {
        textAlign: 'right',
    },
    greyButtonNo: {
        backgroundColor: '#C2C2C2',
        color: 'white',
        borderColor: 'white',
        "&:hover": {
            background: "#469077",
            borderColor: 'white',
        },
    },
    greyButtonYes: {
        backgroundColor: '#C2C2C2',
        color: 'white',
        borderColor: 'white',
        "&:hover": {
            background: "#CD0004",
            borderColor: 'white',
        },
    },
    greenButton: {
        backgroundColor: '#469077',
        color: 'white',
        borderColor: 'white',
    },
    redButton: {
        backgroundColor: '#CD0004',
        color: 'white',
        borderColor: 'white',
    },
}));

type Props = {
    question : Question;
    setAnswerForQuestion : (answer : Answer) => void;
};

const QuestionYesNo = ({question, setAnswerForQuestion} : Props) : ReactElement => {
    const classes = useStyles();

    const [questionAnswer, setQuestionAnswer] = useState<boolean | null>(null);

    const changeYesNoAnswer = (val : boolean) : void => {
        setQuestionAnswer(val);
        setAnswerForQuestion({
            questionId : question.id,
            yes : val,
            type : question.type
        });
    };

    return (
        <>
            <Grid item xs={12} sm={9}>
                <Typography className={classes.questionText} variant={'h5'} align={'left'}>{question.number}. {question.text}</Typography>
                {question.subText && <Typography className={classes.questionSubText}>{question.subText}</Typography>}
            </Grid>
            <Grid item xs={12} sm={3} className={classes.buttons}>
                <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                    <Button className={classes.greyButtonNo+ (questionAnswer === false ? ' ' + classes.greenButton : '')} onClick={() => changeYesNoAnswer(false)}>
                        <Trans i18nKey="question.no">
                            No
                        </Trans>
                    </Button>
                    <Button className={classes.greyButtonYes + (questionAnswer ? ' ' + classes.redButton : '')} onClick={() => changeYesNoAnswer(true)}>
                        <Trans i18nKey="question.yes">
                            Yes
                        </Trans>
                    </Button>
                </ButtonGroup>
            </Grid>
        </>
    );
};

export default QuestionYesNo;
