import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import React from 'react';
import i18n, {changeLanguage} from '../utils/I18n';

type Props = {
    onChange : (lang : string) => void | undefined;
}

const ChangeLanguage = ({onChange} : Props) : React.ReactElement=> {
    const [language, setLanguage] = React.useState(i18n.language.substring(0,2));

    const setLanguageVal = (e : string) : void => {
        setLanguage(e)
        changeLanguage(e);
        if (typeof onChange === 'function') {
            onChange(e);
        }
    }

    return <FormControl>
        <InputLabel id="select-language">Language</InputLabel>
        <Select
            value={language}
            onChange={(e) => setLanguageVal(String(e.target.value) ?? 'en')}
            id="select-language"
        >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
        </Select>
    </FormControl>
}

export default ChangeLanguage;