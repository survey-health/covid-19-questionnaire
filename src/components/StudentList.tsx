import {Typography, Grid} from '@material-ui/core';
import {Theme, makeStyles} from '@material-ui/core/styles';
import React, {ReactElement} from 'react';
import {User} from '../App';

const useStyles = makeStyles((theme : Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    grid: {
        marginTop: '20px',
    },
    studentList: {
        textAlign: 'center',
        backgroundColor: 'white',
    },
    studentRow: {
        padding: '8px',
        "&:hover": {
            backgroundColor: 'lightgrey',
        },
    },
    studentRowComplete: {
        padding: '8px',
        backgroundColor: '#ababab',
    },
}));

type Props = {
    students : User[];
    setStudent : (student : User | null) => void;
    logout : () => void;
};

const StudentList = ({students, setStudent, logout} : Props) : ReactElement => {
    const classes = useStyles();

    console.log('StudentList', students);
    
    const studentList = students.map(student => {
        return <div 
            key={`student-id-${student.id}`} 
            className={student.status === 'Completed' ? classes.studentRowComplete : classes.studentRow} 
            onClick={() => {
                if (student.status !== 'Completed') {
                    setStudent(student)
                }
            }}
        >
            <Typography>{student.name}{student.status === 'Completed' ? ' (Complete)' : ''}</Typography>
        </div>
    });

    return (
        <Grid container spacing={3} className={classes.grid}>
            <Grid item sm={3} xs={12}/>
            <Grid item sm={6} xs={12} className={classes.studentList}>
                <div key={'student-id-header'}>
                    <Typography>Please select a student.</Typography>
                </div>
                {studentList}
                <div key={'student-id-footer'} className={classes.studentRow} onClick={() => logout()}>
                    <Typography>Log out</Typography>
                </div>
            </Grid>
            <Grid item sm={3} xs={12}/>
        </Grid>
    );
}

export default StudentList;
