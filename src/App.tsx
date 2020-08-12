
import {Container} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, {useCallback, useEffect, useState, ReactElement} from 'react';
import AlreadyCompletedDialog from './components/AlreadyCompletedDialog';
import GridQuestionnaire from './components/GridQuestionnaire';
import Maintenance from "./components/Maintenance";
import SignIn from './components/SignIn';
import SignInDob from './components/SignInDob';
import Snackbars from './components/Snackbars';
import {apiEndpoint, apiFetch} from './utils/api';

export type User = {
    id : string;
    name : string;
    type : string;
    schoolName : string;
    schoolId : string;
};

export type Questionnaire = {
    Q01 : string;
    Q02 : string;
    Q03 : string;
    Q04 : string;
    Q05 : string;
    Q06 : number;
    isComplete : boolean;
    recid : string;
};

export type Question = {
    id : string;
    number : number;
    text : string;
    subText : string;
    type : string;
    multipleAnswers : string[];
    maxAcceptable ?: number;
    maxValid ?: number;
    minAcceptable ?: number;
    minValid ?: number;
};

const App = () : ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
    const [authConfirmed, setAuthConfirmed] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [token, setToken] = useState<string | undefined>(undefined);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>('error');
    const [maintenance, setMaintenance] = useState<string | undefined>(process.env.REACT_APP_MAINTENANCE);

    const getUser = useCallback(async () => {
        setUser(null);

        let url = new URL('/v1/user/', apiEndpoint);
        const response = await apiFetch(url.toString(), {}, token);
        const data = await response.json();
        url = new URL('/v1/user/questions', apiEndpoint);
        const questionsResponse = await apiFetch(url.toString(), {}, token);
        const questions = await questionsResponse.json();

        if (response.status !== 200 || data.length <= 0 || questionsResponse.status !== 200 || questions.length === 0) {
            if (response.status === 503) {
                setMaintenance(data.message);
                return;
            }

            setSnackbarMessage('There was an error retrieving the user.');
            setSnackbarOpen(true);
            return;
        }

        setQuestions(questions);
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

        if (response.status !== 200) {
            setSnackbarMessage(response.status === 401 ? 'Invalid id or date of birth.' : 'There was an error signing you in.');
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

        if (response.status !== 200) {
            if (response.status === 503) {
                try {
                    const data = await response.json();
                    setMaintenance(data.message);
                    return;
                } catch (e) { 
                    console.log('error', e.message);
                }
            }
            setSnackbarMessage(response.status === 401 ? 'Invalid id or date of birth.' : 'There was an error signing you in.');
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

        if (response.status !== 201) {
            setSnackbarMessage('There was an error retrieving the questionnaire.');
            setSnackbarOpen(true);
            return;
        }

        setQuestionnaire(data);
    }, [token]);

    useEffect(() => {
        if (user === null) {
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
        if (user !== null) {
            getQuestionnaire(user.type);
        }
    }, [user, getQuestionnaire]);

    const displaySignIn = (method : string) : boolean => {
        return !maintenance && !authConfirmed && process.env.REACT_APP_AUTH_MODE === method;
    }

    return (
        <Container maxWidth="md">
            <CssBaseline/>
            {maintenance && <Maintenance message={maintenance}/>}
            {displaySignIn('AD') && <SignIn signIn={signIn}/>}
            {displaySignIn('DOB') && <SignInDob signIn={signInDob}/>}
            <Snackbars severity={snackbarSeverity} open={snackbarOpen} setOpen={setSnackbarOpen} message={snackbarMessage}/>
            {(authConfirmed && user !== null && questionnaire !== null && !questionnaire.isComplete && undefined !== token && questions) && <GridQuestionnaire
                userType={user.type}
                user={user}
                setUser={setUser}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                token={token}
                questions={questions}
            />}
            {(authConfirmed && user !== null && questionnaire !== null && questionnaire.isComplete) && <AlreadyCompletedDialog setUser={setUser}/>}
        </Container>
    );
}

export default App;
