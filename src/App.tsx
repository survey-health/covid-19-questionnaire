import React, { useCallback, useEffect, useState } from 'react';
import { apiEndpoint, apiFetch } from './utils/api';

import AlreadyCompletedDialog from './components/AlreadyCompletedDialog';
import { Container } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import GridQuestionnaire from './components/GridQuestionnaire';
import SignIn from './components/SignIn';
import Snackbars from './components/Snackbars';
import SignInDob from './components/SignInDob';

export type User = {
    id: string;
    name: string;
    type: string;
    schoolName: string;
    schoolId: string;
};

export type Questionnaire = {
    Q01: string;
    Q02: string;
    Q03: string;
    Q04: string;
    Q05: string;
    Q06: number;
    isComplete: boolean;
    recid: string;
};

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
    const [authConfirmed, setAuthConfirmed] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>('error');

    const getUser = useCallback(async () => {
        setUser(null);

        const url = new URL('/v1/user/', apiEndpoint);
        const response = await apiFetch(url.toString(), {}, token);
        const data = await response.json();

        if (200 !== response.status || data.length <= 0) {
            setSnackbarMessage('There was an error retrieving the user.');
            setSnackbarOpen(true);
            return;
        }

        setUser(data[0]);
    }, [token]);

    const signIn = useCallback(async (username, password) => {
        setToken(undefined);
        const url = new URL('/V1/login/authenticate', apiEndpoint);
        const response = await apiFetch(url.href, {
            method: 'POST',
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })

        if (200 !== response.status) {
            setSnackbarMessage(401 === response.status ? 'Invalid id or date of birth.' : 'There was an error signing you in.');
            setSnackbarOpen(true);
            return;
        }

        const data = await response.json();

        setToken(data.jwt);
        setAuthConfirmed(true);
    }, []);

    const signInDob = useCallback(async (id, dob) => {
        setToken(undefined);
        const url = new URL('/V1/login/authenticate', apiEndpoint);
        const response = await apiFetch(url.href, {
            method: 'POST',
            body: JSON.stringify({
                "id": id,
                "dob": dob
            }),
        })

        if (200 !== response.status) {
            setSnackbarMessage(401 === response.status ? 'Invalid id or date of birth.' : 'There was an error signing you in.');
            setSnackbarOpen(true);
            return;
        }

        const data = await response.json();

        setToken(data.jwt);
        setAuthConfirmed(true);
    }, []);

    const getQuestionnaire = useCallback(async (type) => {
        const url = new URL('/v1/' + type + '/getCurrentQuestionnaire', apiEndpoint);
        const response = await apiFetch(url.href, {}, token)
        const data = await response.json();

        if (201 !== response.status) {
            setSnackbarMessage('There was an error retrieving the questionnaire.');
            setSnackbarOpen(true);
            return;
        }

        setQuestionnaire(data);
    }, [token]);

    useEffect(() => {
        if (null === user) {
            setAuthConfirmed(false);
            setQuestionnaire(null);
        }
    }, [user]);

    useEffect(() => {
        if (undefined !== token) {
            getUser();
        }
    }, [token, getUser]);

    useEffect(() => {
        if (null !== user) {
            getQuestionnaire(user.type);
        }
    }, [user, getQuestionnaire]);

    return (
        <Container maxWidth="md">
            <CssBaseline />
            {!authConfirmed && process.env.REACT_APP_AUTH_MODE === 'AD' && <SignIn signIn={signIn} />}
            {!authConfirmed && process.env.REACT_APP_AUTH_MODE === 'DOB' && <SignInDob signIn={signInDob} />}
            <Snackbars severity={snackbarSeverity} open={snackbarOpen} setOpen={setSnackbarOpen} message={snackbarMessage} />
            {(authConfirmed && null !== user && null !== questionnaire && !questionnaire.isComplete && undefined !== token) && <GridQuestionnaire
                userType={user.type}
                questionnaire={questionnaire}
                user={user}
                setUser={setUser}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                token={token}
            />}
            {(authConfirmed && null !== user && null !== questionnaire && questionnaire.isComplete) && <AlreadyCompletedDialog setUser={setUser} />}
        </Container>
    );
}

export default App;
