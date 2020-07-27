import React from 'react';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

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
    message: string;
};

export default function Maintenance({ message }: Props) {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5" style={{ fontWeight: 700 }}>
                    COVID-19 Daily
                </Typography>
                <Typography component="h1" variant="h5" style={{ fontWeight: 700 }}>
                    Self-Certification Survey
                </Typography>
                <img src={"/logos/DistrictLogo.png"} className={classes.logo} alt="District Logo" />
                <span>
                    {message}
                </span>
            </Paper>
        </Container>
    );
}
