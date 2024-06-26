import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Paper, Box, Button, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import * as API from './../API/API';
import InfoAlert from './InfoAlert';

export default function ArticleDocs() {
    
    const baseURL                                       = process.env.REACT_APP_BASE_URL;
    const { search }                                    = useLocation();
    const params                                        = new URLSearchParams(search);
    const userID                                        = params.get('userid');
    const articleID                                     = params.get('articleid');
    const articleCategory                               = params.get('category');
    const [userName, setUserName]                       = useState('');
    const [articleName, setArticleName]                 = useState('');
    const [fileNameInputValue, setFileNameInputValue]   = useState('');
    const [titlesRawMaterial, setTitlesRawMaterial]     = useState([
        {
            description: 'Alkatrész a gyártó honlapján',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Alkatrész adatlapja 1',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Alkatrész adatlapja 2',
            folder: '',
            fileName: ''
        },
        {
            description: 'Katalógus',
            folder: '',
            fileName: ''
        },
        {
            description: 'Termék specifikáció',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Összeszerelési utasítás',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'CAD Rajz',
            folder: '',
            fileName: ''
        }, 
        {
            description: '3D Modell',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Bejövő áru ellenőrzés',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'MSDS adatlap',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'REACH nyilatkozat',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'RoHS nyilatkozat',
            folder: '',
            fileName: ''
        }
    ]);
    const [titlesFinishedProd, setTitlesFinishedProd]   = useState([
        {
            description: 'Vevői rajz 1',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Vevői rajz 2',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Vevői darabjegyzék',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'ACSG rajz',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Jóváhagyási jegyzőkönyv',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Darabolási lista',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Vizsgálati terv',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Csomagolái utasítás',
            folder: '',
            fileName: ''
        }, 
        {
            description: 'Információ cellagyártáshoz',
            folder: '',
            fileName: ''
        }
    ]);
    const [imageFiles, setImageFiles]                   = useState(Array.from({ length: ((articleCategory === '30000') || (articleCategory === '60000')) ? titlesRawMaterial.length+1 : titlesFinishedProd.length+1 }, () => null));
    const [showInfoAlert, setShowInfoAlert]             = useState(false);
    const [saveIsSuccess, setSaveIsSuccess]             = useState(false);
    const [alertMessage, setAlertMessage]               = useState('');
    const fileInputRefs                                 = useRef([]);
    
    const handleCloseAlert = () => {
        setShowInfoAlert(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleInputChange = (e) => {
        setFileNameInputValue(e.target.value);
    };
    
    const handleFileChange = (index, e) => {
        let selectedImage;
        
        if(((articleCategory === '30000') || (articleCategory === '60000')) && index === 0) {
            selectedImage = e.target.value;
        } else {
            selectedImage = e.target.files[0];
        }

        const newImageFiles = [...imageFiles];
        newImageFiles[index] = selectedImage;
        setImageFiles(newImageFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        if ((articleCategory === '30000') || (articleCategory === '60000')) {
            if (imageFiles) {
                formData.append(`url`, imageFiles[0]);
            }
            
            imageFiles.slice(1).forEach((file, index) => {
                if (file) {
                    formData.append(`file_${index+1}`, file);
                }
            });
        } else {
            imageFiles.forEach((file, index) => {
                if (file) {
                    formData.append(`file_${index}`, file);
                }
            });
        }

        formData.append('category', articleCategory);
        formData.append('articleID', articleID);
        formData.append('userID', userID);

        try {
            const response = await API.uploadFiles(formData, articleCategory);

            if (response.ok) {
                console.log('Files uploaded successfully');
                setAlertMessage("Sikeres mentés!");
                setSaveIsSuccess(true);
                setShowInfoAlert(true);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                console.error('Failed to upload files');
                setAlertMessage("Sikertelen mentés!");
                setSaveIsSuccess(false);
                setShowInfoAlert(true);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            setAlertMessage("Sikertelen mentés!");
            setSaveIsSuccess(false);
            setShowInfoAlert(true);
        }
    };

    const getUser = async (userID) => {
        try {
          const response = await fetch(
            `${baseURL}/api/v2/login/byID/${userID}`,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
          const data = await response.json();
          setUserName(data.userName);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
    };

    const getArticle = async (articleID) => {
        try {
          const response = await fetch(
            `${baseURL}/api/v2/article-docs/get-article/${articleID}`,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
          const data = await response.json();
          setArticleName(data.articleName);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
    };

    const getArticleFiles = async (articleID, articleCategory) => {
        try {
            const response = await fetch(
                `${baseURL}/api/v2/article-docs/get-files/${articleID}/${articleCategory}`,
                {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache'
                });

            const data = await response.json();
            const titlesArray = ((articleCategory === '30000') || (articleCategory === '60000')) ? titlesRawMaterial : titlesFinishedProd;

            data.forEach(dataItem => {
                const matchingTitle = titlesArray.find(title => title.description === dataItem.description);
                if (matchingTitle) {
                    matchingTitle.folder = dataItem.folder;
                    matchingTitle.fileName = dataItem.fileName;
                }
            });

            if ((articleCategory === '30000') || (articleCategory === '60000')) {
                setTitlesRawMaterial([...titlesArray]);
            } else {
                setTitlesFinishedProd([...titlesArray]);
            }

        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    useEffect( () => {
        getUser(userID);
        getArticle(articleID);
        getArticleFiles(articleID, articleCategory);
    }, []);

    return (
        <Container sx={{ justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ padding: '2em', textAlign: 'center', marginTop: '2em' }}>
                {showInfoAlert && <InfoAlert success={saveIsSuccess} onClose={handleCloseAlert} message={alertMessage} />}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Typography variant='h4' textAlign='center' sx={{ marginBottom: '1em' }}>Árucikk - Dokumentumok rögzítése</Typography>
                    <Typography key={"userName"} variant='h6'><b>Felhasználó:</b> {userName}</Typography>
                    <Typography key={"artDesc"} variant='h6'><b>Árucikk:</b> {articleName}</Typography>
                    <Divider sx={{ margin: '2em 0' }} />
                    { ((articleCategory === '30000') || (articleCategory === '60000')) && (
                        <Box sx={{ marginTop: '1em' }}>
                            <div key={"div0"} style={{ 'marginBottom': '1em' }}>
                                <Typography key={0} variant="h6" sx={{ display: 'inline-block', marginRight: '1em', width: '260px', textAlign: 'right' }}>
                                    {titlesRawMaterial[0].description}
                                </Typography>
                                <input
                                    id="filePathInput0"
                                    key={"filePathInput0"}
                                    type="text"
                                    value={fileNameInputValue !== '' ? fileNameInputValue : (titlesRawMaterial[0].fileName ? titlesRawMaterial[0].fileName : '')}
                                    style={{ padding: '10px', width: '300px' }}
                                    onBlur={(e) => {
                                        handleInputChange(e);
                                        handleFileChange(0, e);
                                    }}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />
                                <input
                                    id="fileInput0"
                                    key={"fileInput0"}
                                    type="text"
                                    ref={element => fileInputRefs.current[0] = element}
                                    style={{ display: 'none' }}
                                    onChange={e => handleFileChange(0, e)}
                                />
                                <label htmlFor="fileInput0" style={{ visibility: 'hidden' }}>
                                    <Button variant="contained" color="primary" component="span" sx={{ visibility: 'hidden', marginLeft: '1em' }}>
                                        Feltöltés
                                    </Button>
                                </label>
                            </div>
                            {
                                titlesRawMaterial.slice(1).map( (title, index) => (
                                    <React.Fragment key={`fragment${index}`}>
                                        <div key={`div${index+1}`} style={{ 'marginBottom': '1em' }}>
                                            <Typography key={index+1} variant="h6" sx={{ display: 'inline-block', marginRight: '1em', width: '260px', textAlign: 'right' }}>
                                                {title.description}
                                            </Typography>
                                            <input
                                                id={`filePathInput${index+1}`}
                                                key={`filePathInput${index+1}`}
                                                type="text"
                                                value={imageFiles[index+1] ? imageFiles[index+1]["name"] : title.fileName}
                                                disabled
                                                style={{ padding: '10px', width: '300px' }}
                                            />
                                            <input
                                                accept='*'
                                                id={`fileInput${index+1}`}
                                                key={`fileInput${index+1}`}
                                                type="file"
                                                ref={element => fileInputRefs.current[index+1] = element}
                                                style={{ display: 'none' }}
                                                onChange={e => handleFileChange(index+1, e)}
                                            />
                                            <label htmlFor={`fileInput${index+1}`}>
                                                <Button variant="contained" color={title.fileName ? 'warning' : 'primary'} component="span" sx={{ marginLeft: '1em' }}>
                                                    {title.fileName ? 'Módosítás' : 'Feltöltés'}
                                                </Button>
                                            </label>
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </Box>
                    )}
                    { ((articleCategory === '10000') || (articleCategory === '20000')) && (
                        <Box sx={{ marginTop: '1em' }}>
                            {
                                titlesFinishedProd.map( (title, index) => (
                                    <React.Fragment key={`fragment${index}`}>
                                        <div key={`div${index}`} style={{ 'marginBottom': '1em' }}>
                                            <Typography key={index} variant="h6" sx={{ display: 'inline-block', marginRight: '1em', width: '260px', textAlign: 'right' }}>
                                                {title.description}
                                            </Typography>
                                            <input
                                                id={`filePathInput${index}`}
                                                key={`filePathInput${index}`}
                                                type="text"
                                                value={imageFiles[index] ? imageFiles[index]["name"] : title.fileName}
                                                disabled
                                                style={{ padding: '10px', width: '300px' }}
                                            />
                                            <input
                                                accept='*'
                                                id={`fileInput${index}`}
                                                key={`fileInput${index}`}
                                                type="file"
                                                ref={element => fileInputRefs.current[index] = element}
                                                style={{ display: 'none' }}
                                                onChange={e => handleFileChange(index, e)}
                                            />
                                            <label htmlFor={`fileInput${index}`}>
                                                <Button variant="contained" color={title.fileName ? 'warning' : 'primary'} component="span" sx={{ marginLeft: '1em' }}>
                                                    {title.fileName ? 'Módosítás' : 'Feltöltés'}
                                                </Button>
                                            </label>
                                        </div>
                                    </React.Fragment>
                                ))
                            }
                        </Box>
                    )}
                    { articleCategory && <Button type="submit" variant="contained" color="success" sx={{ marginTop: '1em' }}>Mentés</Button> }
                </form>
            </Paper>
        </Container>
    );
}