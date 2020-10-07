
import {Paper} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, {useState, ReactElement} from 'react';
import {Trans} from 'react-i18next';
import i18n from '../utils/I18n';

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
        backgroundColor: process.env.REACT_APP_THEME_BACKGROUND_COLOR,
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
                    <Trans i18nKey="common.covid19Daily">
                        COVID-19 Daily
                    </Trans>
                </Typography>
                <Typography component="h1" variant="h5" style={{fontWeight: 700}}>
                    <Trans i18nKey="common.selfCertificationSurvey">
                        Self-Certification Survey
                    </Trans>
                </Typography>
                <img
                    src={"/logos/DistrictLogo.png"}
                    className={classes.logo}
                    alt={i18n.t('common.districtLogo', 'District Logo')}
                />
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="idNumber"
                        label={i18n.t('signIn.idNumber', 'ID Number')}
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
                        label={i18n.t('signIn.dob', 'DOB')}
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
                        <Trans i18nKey="signIn.signIn">
                            Sign In
                        </Trans>
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default SignInDob;
