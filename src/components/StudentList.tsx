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
    headerBold: {
        color: '#000',
        fontWeight: 700,
        textAlign: 'center',
        paddingBottom: '20px',
        marginBottom: '10px',
    },
    footerBold: {
        color: '#000',
        fontWeight: 700,
        textAlign: 'center',
        marginTop: '30px',
        "&:hover": {
            backgroundColor: 'lightgrey',
        },
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
    
    const studentList = students.map(student => {
        return <div 
            key={`student-id-${student.id}`} 
            className={student.status === 'Not Completed' ? classes.studentRow : classes.studentRowComplete} 
            onClick={() => {
                if (student.status === 'Not Completed') {
                    setStudent(student)
                }
            }}
        >
            <Typography>{student.name} ({student.status})</Typography>
        </div>
    });

    return (
        <Grid container spacing={3} className={classes.grid}>
            <Grid item sm={3} xs={12}/>
            <Grid item sm={6} xs={12} className={classes.studentList}>
                <div key={'student-id-header'}>
                    <Typography className={classes.headerBold}>Please select a student from the list below:</Typography>
                </div>
                {studentList}
                <div key={'student-id-footer'}>
                    <Typography onClick={() => logout()} className={classes.footerBold}>Log out</Typography>
                </div>
            </Grid>
            <Grid item sm={3} xs={12}/>
        </Grid>
    );
}

export default StudentList;
