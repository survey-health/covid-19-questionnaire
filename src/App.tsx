import {Container} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import AlreadyCompletedDialog from './components/AlreadyCompletedDialog';
import GridQuestionnaire from './components/GridQuestionnaire';
import Maintenance from "./components/Maintenance";
import SignIn from './components/SignIn';
import SignInDob from './components/SignInDob';
import SignInSaml from './components/SignInSaml';
import Snackbars from './components/Snackbars';
import StudentList from './components/StudentList';
import {apiEndpoint, apiFetch} from './utils/api';
import i18n from './utils/I18n';

export type User = {
    id : string;
    name : string;
    type : string;
    schoolName : string;
    schoolId : string;
    status ?: string;
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

const getQuestions = async (language : string, token : string) => {
    const url = new URL('/v1/user/questions', apiEndpoint);
    const init = {headers: new Headers({'Accept-Language': language})};
    const questionsResponse = await apiFetch(url.toString(), init, token);
    const questions = await questionsResponse.json();

    if (questionsResponse.status === 200 && questions.length > 0) {
        return questions;
    }
}

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
    const {t} = useTranslation('ns1', {i18n});

    // USER_MODE = PARENT
    const [students, setStudents] = useState<User[] | null>(null);
    const [student, setStudent] = useState<User | null>(null);
    const studentListMode = process.env.REACT_APP_USER_MODE === 'PARENT' && user?.type === 'guardian';

    const onLanguageChange = (langugage : string) : void => {
        if (token) {
            getQuestions(langugage, token).then((questions) => setQuestions(questions))
        }
    }

    const getStudents = useCallback(async () => {
        const url = new URL('/v1/user/get-students', apiEndpoint);
        const response = await apiFetch(url.href, {}, token)
        const data = await response.json();

        if (response.status !== 200) {
            setSnackbarMessage(
                i18n.t(
                    'app.errorLoadingStudent',
                    'There was an error retrieving students for this user.'
                )
            );
            setSnackbarOpen(true);
            return;
        }

        setStudents(data);
    }, [token]);

    const updateStudentStatus = (updateStudent : User, status : string) => {
        if (students !== null) {
            const newStudents = students?.map(student => {
                if (updateStudent.id === student.id) {
                    student.status = status
                }

                return student;
            });

            setStudents(newStudents);
        }
    }

    const logout = () => {
        setToken(undefined);
        setAuthConfirmed(false);
        setUser(null);
    }

    const getSamlToken = (async () : Promise<boolean> => {
        try {
            const url = new URL('/v1/login/sp/token', apiEndpoint);
            const response = await apiFetch(
                url.toString(),
                {
                    credentials: 'include'//needed to send cookies
                }
            );
            const newToken = await response.text();

            if (response.status !== 200 || newToken.length <= 0) {
                return false;
            }

            setToken(newToken);
            setAuthConfirmed(true);
            return true;
        } catch (e) {
            return false;
        }
    });

    const getUser = useCallback(async () => {
        if (!token) {
            return;
        }
        setUser(null);

        const url = new URL('/v1/user/', apiEndpoint);
        const response = await apiFetch(url.toString(), {}, token);
        const data = await response.json();
        const questions = await getQuestions(i18n.language, token)

        if (response.status !== 200 || data.length <= 0 || questions.length === 0) {
            if (response.status === 503) {
                setMaintenance(data.message);
                return;
            }

            setSnackbarMessage(
                i18n.t(
                    'app.errorLoadingUser',
                    'There was an error retrieving the user.'
                )
            );
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
            setSnackbarMessage(
                response.status === 401
                    ? i18n.t('app.invalidIdOrDob', 'Invalid id or date of birth.')
                    : i18n.t('app.errorSigningIn', 'There was an error signing you in.')
            );
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
            setSnackbarMessage(
                response.status === 401
                    ? i18n.t('app.invalidIdOrDob', 'Invalid id or date of birth.')
                    : i18n.t('app.errorSigningIn', 'There was an error signing you in.')
            );
            setSnackbarOpen(true);
            return;
        }

        const data = await response.json();

        setToken(data.jwt);
        setAuthConfirmed(true);
    }, []);

    const getQuestionnaire = useCallback(async (type : string, studentId ?: string) => {
        const url = new URL('/v1/' + type + '/get-current-questionnaire' + (studentId ? `/${studentId}` : ''), apiEndpoint);
        const response = await apiFetch(url.href, {}, token)
        const data = await response.json();

        if (response.status !== 201) {
            setSnackbarMessage(
                i18n.t(
                    'app.errorLoadingQuestionnaire',
                    'There was an error retrieving the questionnaire.'
                )
            );
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
        if (!studentListMode && user !== null) {
            getQuestionnaire(user.type);
        }

        if (studentListMode && user !== null && student !== null) {
            getQuestionnaire('student', student.id);
        }
    }, [user, getQuestionnaire, student, studentListMode]);

    useEffect(() => {
        if (studentListMode) {
            getStudents();
        }
    }, [user, studentListMode, getStudents]);

    useEffect(() => {
        if (process.env.REACT_APP_THEME_BACKGROUND_COLOR !== undefined) {
            document.body.style.background = process.env.REACT_APP_THEME_BACKGROUND_COLOR;
        }
    }, []);

    const displaySignIn = (method : string) : boolean => {
        return !maintenance && !authConfirmed && process.env.REACT_APP_AUTH_MODE === method;
    }

    if (studentListMode && students !== null && student === null) {
        return <StudentList students={students} setStudent={setStudent} logout={logout} onLanguageChange={onLanguageChange}/>;
    }

    return (
        <Container maxWidth="md">
            <CssBaseline/>
            {maintenance && <Maintenance message={maintenance}/>}
            {displaySignIn('AD') && <SignIn signIn={signIn}/>}
            {displaySignIn('DOB') && <SignInDob signIn={signInDob}/>}
            {displaySignIn('SAML') && <SignInSaml getSamlToken={getSamlToken} apiEndpoint={apiEndpoint} onLanguageChange={onLanguageChange}/>}
            <Snackbars severity={snackbarSeverity} open={snackbarOpen} setOpen={setSnackbarOpen} message={snackbarMessage}/>
            {(authConfirmed && !studentListMode && user !== null && questionnaire !== null && !questionnaire.isComplete && undefined !== token && questions) && <GridQuestionnaire
                userType={user.type}
                user={user}
                setUser={setUser}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                token={token}
                questions={questions}
                studentListMode={false}
                updateStudentStatus={updateStudentStatus}
                onLanguageChange={onLanguageChange}
            />}
            {(authConfirmed && studentListMode && user !== null && student !== null && questionnaire !== null && !questionnaire.isComplete && undefined !== token && questions) && <GridQuestionnaire
                userType={'student'}
                user={student}
                setUser={setStudent}
                setSnackbarOpen={setSnackbarOpen}
                setSnackbarMessage={setSnackbarMessage}
                token={token}
                questions={questions}
                studentListMode={studentListMode}
                updateStudentStatus={updateStudentStatus}
                onLanguageChange={onLanguageChange}
            />}
            {(authConfirmed && user !== null && questionnaire !== null && questionnaire.isComplete) && <AlreadyCompletedDialog
                setUser={setUser}
                setQuestionnaire={setQuestionnaire}
                studentListMode={studentListMode}
                setStudent={setStudent}
            />}
        </Container>
    );
}

export default App;
