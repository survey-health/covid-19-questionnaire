
import {Grid, Paper} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, {useState, ReactElement, useEffect} from 'react';

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
    errorText: {
        color: 'red',
    },
}));

type Props = {
    getSamlToken : () => Promise<boolean>;
    apiEndpoint : string;
};

const SignInSaml = ({getSamlToken, apiEndpoint} : Props) : ReactElement => {
    const classes = useStyles();
    const [error, setError] = useState('');

    const redirectSignIn = () => {
        window.location.href = apiEndpoint + '/v1/login/sp/redirect';
    }

    useEffect(() => {
        switch (window.location.hash.substr(1)) {
        case "saml-success":
            getSamlToken().then(r => {
                if (!r) {
                    setError("There was a error logging you in. (e:1)");
                }
            });
            break;
        case "saml-error":
            setError("There was a error logging you in. (e:2)");
            break;
        }
        window.location.hash = "";
    }, [setError, getSamlToken]);

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
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.signInButton}
                        onClick={redirectSignIn}
                    >
                        Sign In
                    </Button>
                </form>
                {error && <Grid item xs={12}>
                    <Typography className={classes.errorText} variant={'h5'} align={'center'}>
                        {error}
                    </Typography>
                </Grid>}
            </Paper>
        </Container>
    );
}

export default SignInSaml;
