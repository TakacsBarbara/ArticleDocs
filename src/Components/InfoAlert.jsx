import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import useWindowDimensions from './../Hooks/useWindowDimensions';

export default function InfoAlert({ success, onClose, message }) {
    const [isOpen, setIsOpen] = useState(true);
    const alertClass = success ? 'success' : 'error';
    const {width} = useWindowDimensions();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false);
            onClose();
        }, 2000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const dialogStyles = {
        width: width > 500 ? '550px' : '350px',
        height: width > 500 ? '200px' : '100px',
        fontSize: width > 500 ? '22px' : '16px',
        textAlign: 'center',
        border: success ? '5px solid #04c70e' : '5px solid #c0392b',
        borderRadius: '20px',
        backgroundColor: success ? '#f4ffe6' : '#fcebeb'
    };

    const messageStyles = {
        color: success ? '#04c70e' : '#c0392b',
        fontSize: width > 500 ? '21px' : '16px'
    };

    return (
        <Dialog open={isOpen} onClose={() => {}} className={`save-alert ${alertClass}`} PaperProps={{ style: dialogStyles }}>
            <DialogContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <DialogContentText style={messageStyles}>{message}</DialogContentText>
            </DialogContent>
        </Dialog>
    );
}