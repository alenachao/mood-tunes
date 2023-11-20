import  React, {useState} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Calendar from '@/components/Calendar'
import { Typography, Stack, Container, makeStyles } from '@mui/material';
import moment from 'moment'
import Header from '@/components/Header';
import { DateCalendar} from '@mui/x-date-pickers'

export default function Entry() {
    const [dateState, setDateState] = useState(new Date())
    

    return (
        <Container sx={{ py: 2, position: 'relative' }}>
            <Header />
            <Stack direction="row" spacing={10} justifyContent='center' margin="5em" >
            <Calendar dateState={dateState} setDateState={setDateState}/>
            
            <Stack direction="column" >
                <Typography textAlign="center" variant="h1">
                    How do you feel today?
                </Typography>
                <Typography textAlign="center" variant="subtitle1">
                    {moment(dateState).format('MMMM Do YYYY')}
                </Typography>
            </Stack>
            </Stack>
            <Header />
        </Container>
    );
  }

