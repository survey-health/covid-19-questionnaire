import {Grid, Typography, TextField} from '@material-ui/core';
import {Question} from '../App';
import React, { useState } from 'react';
import { useStyles, Answer} from './GridQuestionnaire';

type Props = {
    question : Question;
    setAnswerForQuestion : (answer: Answer) => void;
};

const QuestionNumber = ({ question, setAnswerForQuestion}: Props) => {
    const classes = useStyles();
    const [questionAnswer, setQuestionAnswer] = useState<string>('');
    const setAnswer = (val : string) :void => {
        let unAcceptable = false;

        if (question.maxAcceptable !== undefined && question.minAcceptable !== undefined) {
            unAcceptable = parseFloat(val) < question.minAcceptable || parseFloat(val) > question.maxAcceptable;
        }

        setQuestionAnswer(val);
        setAnswerForQuestion({
            questionId: question.id,
            yes: unAcceptable,
            number: parseFloat(val),
            type: question.type
        });
    };

    let inValid = false;

    if (question.minValid !== undefined && question.maxValid !== undefined) {
        inValid = parseFloat(questionAnswer!) < question.minValid || parseFloat(questionAnswer!) > question.maxValid;
    }

    return (
        <>
            <Grid item xs={12} sm={9}>
                <Typography className={classes.questionText} variant={'h5'} align={'left'}>{question.number}. {question.text}</Typography>
                {question.subText && <Typography>{question.subText}</Typography>}
            </Grid>
            <Grid item xs={12} sm={3} className={classes.buttons}>
                <TextField
                    variant="outlined"
                    style={{ width: "100%" }}
                    error={inValid}
                    value={questionAnswer} 
                    onChange={e => setAnswer(e.target.value)}
                />
            </Grid>
        </>
    );
};

export default QuestionNumber;
