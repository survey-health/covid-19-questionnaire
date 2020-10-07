
import {Paper} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, {ReactElement} from 'react';
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
    },
}));

type Props = {
    message : string;
};

const Maintenance = ({message} : Props) : ReactElement => {
    const classes = useStyles();

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
                <span>
                    {message}
                </span>
            </Paper>
        </Container>
    );
}

export default Maintenance;
