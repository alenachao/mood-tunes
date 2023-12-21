import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar} from '@mui/x-date-pickers'
import Calendar from 'react-calendar'
import { styled } from '@mui/material';
import 'react-calendar/dist/Calendar.css'
import "@/assets/css/Calendar.css";
import { useTheme } from '@mui/material/styles';


  
  export default function StyledComponents({dateState, setDateState}) {
    const theme = useTheme();

    const MyCalendar = styled(Calendar)({
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
    });
    const changeDate = (e) => {
        setDateState(e)
    }
    return <MyCalendar value={dateState} onChange={setDateState}/>;
  }