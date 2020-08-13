import {Grid, Typography, TextField} from '@material-ui/core';
import React, {useState, ReactElement} from 'react';
import {Question} from '../App';
import {useStyles, Answer} from './GridQuestionnaire';

type Props = {
    question : Question;
    setAnswerForQuestion : (answer : Answer) => void;
    removeQuestionAnswer : (questionId : string) => void;
};

const QuestionNumber = ({question, setAnswerForQuestion, removeQuestionAnswer} : Props) : ReactElement => {
    const classes = useStyles();
    const [questionAnswer, setQuestionAnswer] = useState<string>('');
    const [inValid, setInValid] = useState<boolean>(false);
    const setAnswer = (val : string) : void => {
        setQuestionAnswer(val);
        let invalidState = false;
        const floatVal = parseFloat(val);
        if (question.minValid !== undefined && question.maxValid !== undefined) {
            invalidState = floatVal < question.minValid || floatVal > question.maxValid;
            setInValid(invalidState);
        }

        if (invalidState) {
            removeQuestionAnswer(question.id);
            return;
        }

        let unAcceptable = false;

        if (question.maxAcceptable !== undefined && question.minAcceptable !== undefined) {
            unAcceptable = floatVal < question.minAcceptable || floatVal > question.maxAcceptable;
        }

        setAnswerForQuestion({
            questionId: question.id,
            yes: unAcceptable,
            number: floatVal,
            type: question.type
        });
    };

    return (
        <>
            <Grid item xs={12} sm={9}>
                <Typography className={classes.questionText} variant={'h5'} align={'left'}>{question.number}. {question.text}</Typography>
                {question.subText && <Typography className={classes.questionSubText}>{question.subText}</Typography>}
            </Grid>
            <Grid item xs={12} sm={3} className={classes.buttons}>
                <TextField
                    variant="outlined"
                    style={{width: "100%"}}
                    error={inValid}
                    value={questionAnswer} 
                    onChange={e => setAnswer(e.target.value)}
                />
            </Grid>
        </>
    );
};

export default QuestionNumber;
