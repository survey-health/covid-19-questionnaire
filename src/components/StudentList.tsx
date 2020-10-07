import {Typography, Grid, Paper, Container} from '@material-ui/core';
import {Theme, makeStyles} from '@material-ui/core/styles';
import React, {ReactElement} from 'react';
import {Trans} from 'react-i18next';
import {User} from '../App';
import i18n from '../utils/I18n';

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
    logo: {
        maxHeight: '150px',
    },
    paper: {
        marginTop: '32px',
        marginBottom: '32px',
        padding: '20px',
        backgroundColor: 'white',
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
        <Container component="main" maxWidth="md">
            <Paper variant="outlined" className={classes.paper}>
                <div style={{textAlign: 'center'}}>
                    <img
                        src={"/logos/DistrictLogo.png"}
                        className={classes.logo}
                        alt={i18n.t('common.districtLogo', 'District Logo')}
                    />
                </div>

                <Grid container spacing={3} className={classes.grid}>
                    <Grid item sm={3} xs={12}/>
                    <Grid item sm={6} xs={12} className={classes.studentList}>
                        <div key={'student-id-header'}>
                            <Typography className={classes.headerBold}>
                                <Trans i18nKey="studentList.pleaseSelectStudent">
                                    Please select a student from the list below:
                                </Trans>
                            </Typography>
                        </div>
                        {studentList}
                        <div key={'student-id-footer'}>
                            <Typography onClick={() => logout()} className={classes.footerBold}>
                                <Trans i18nKey="common.logOut">
                                    Log out
                                </Trans>
                            </Typography>
                        </div>
                    </Grid>
                    <Grid item sm={3} xs={12}/>
                </Grid>
            </Paper>
        </Container>
    );
}

export default StudentList;
