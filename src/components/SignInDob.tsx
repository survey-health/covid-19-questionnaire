
import {Paper} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, {useState, ReactElement} from 'react';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: '32px',
        marginBottom: '32px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        maxHeight: '250px',
        maxWidth: '100%',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    signInButton: {
        margin: theme.spacing(3, 0, 2),
        lineHeight: 2.5,
    },
}));

type Props = {
    signIn : (idNumber : string, dob : string) => Promise<void>;
};

const SignInDob = ({signIn} : Props) : ReactElement => {
    const classes = useStyles();
    const [idNumber, setIdNumber] = useState('');
    const [dob, setDob] = useState('');

    const handleSignIn = () => {
        signIn(idNumber, dob);
    }

    const checkSubmit = (e : React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            signIn(idNumber, dob);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5" style={{fontWeight: 700}}>
                    COVID-19 Daily
                </Typography>
                <Typography component="h1" variant="h5" style={{fontWeight: 700}}>
                    Self-Certification Survey
                </Typography>
                <img src={"/logos/DistrictLogo.png"} className={classes.logo} alt="District Logo"/>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="idNumber"
                        label="ID Number"
                        name="idNumber"
                        autoComplete="idNumber"
                        autoFocus
                        onChange={(e) => setIdNumber(e.currentTarget.value)}
                        value={idNumber}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="dob"
                        label="DOB"
                        type="dob"
                        id="dob"
                        autoComplete="current-dob"
                        onChange={(e) => setDob(e.currentTarget.value)}
                        onKeyDown={checkSubmit}
                        value={dob}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.signInButton}
                        onClick={handleSignIn}
                    >
                        Sign In
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default SignInDob;
