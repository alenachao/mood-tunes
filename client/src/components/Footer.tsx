import React from 'react';
import { Button, Container } from '@mui/material/';

export default function Footer() {
    return (
        <Container maxWidth={false} style={{borderRadius: '10px', marginTop: '2em', marginBottom:'2em', padding: '1.5em', textAlign:'center', alignContent:'center', justifyContent:'center', background:'#141414'}}>
            <Button variant='h6' href="https://github.com/alenachao/moodytoones" style={{color: 'white'}}>Thanks for stopping by! Check out the Github here :)</Button>
        </Container>
    );
    }