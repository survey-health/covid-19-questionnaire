import {Grid, Typography, Button, ButtonGroup} from '@material-ui/core';
import {Question} from '../App';
import React, { useState } from 'react';
import { useStyles, Answer} from './GridQuestionnaire';

type Props = {
    question: Question;
    setAnswerForQuestion: (answer: Answer) => void;
};

const QuestionYesNo = ({ question, setAnswerForQuestion}: Props) => {
    const classes = useStyles();

    const [questionAnswer, setQuestionAnswer] = useState<boolean | null>(null);

    const changeYesNoAnswer = (val: boolean) :void => {
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
                {question.subText && <Typography>{question.subText}</Typography>}
            </Grid>
            <Grid item xs={12} sm={3} className={classes.buttons}>
                <ButtonGroup color="primary" aria-label="outlined primary button group" fullWidth>
                    <Button className={classes.greyButtonNo+ (false === questionAnswer ? ' ' + classes.greenButton : '')} onClick={() => changeYesNoAnswer(false)}>No</Button>
                    <Button className={classes.greyButtonYes + (questionAnswer ? ' ' + classes.redButton : '')} onClick={() => changeYesNoAnswer(true)}>Yes</Button>
                </ButtonGroup>
            </Grid>
        </>
    );
};

export default QuestionYesNo;
