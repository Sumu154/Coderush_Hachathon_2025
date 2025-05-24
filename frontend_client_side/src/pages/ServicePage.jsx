import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
//import AppNavbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import '../components/css/ServicePage.css';
import ServiceList from '../components/allCards/ServiceList';

const ServicePage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    const keywordParam = queryParams.get('keyword');

    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(keywordParam || '');

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [services, searchQuery, categoryParam]);

    useEffect(() => {
        setSearchQuery(keywordParam || '');
    }, [keywordParam]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/services', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setServices(data);
            setFilteredServices(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch services');
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...services];

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(service =>
                service.service_title.toLowerCase().includes(query) ||
                (service.service_category && service.service_category.toLowerCase().includes(query))
            );
        }

        if (categoryParam) {
            filtered = filtered.filter(service =>
                service.service_category.toLowerCase().includes(categoryParam.toLowerCase())
            );
        }

        setFilteredServices(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <>
            
            <Box className="content item-content" display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={6}>
                <Typography variant="h4" component="h1" className="page-title" mb={6}>
                    Services for Sale
                </Typography>

                {/* Search Bar */}
                <Box sx={{
                    width: '80%',
                    maxWidth: '50rem',
                    mb: 3,
                    mx: 'auto'
                }}>
                    <TextField
                        fullWidth
                        placeholder="Search services by title or category"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#2d4f8f' }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch} edge="end" size="small">
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2d4f8f',
                                }
                            }
                        }}
                    />
                </Box>

                <Box className="main-container" width="100%" maxWidth="1200px" mb={4}>
                    {loading ? (
                        <Box className="loading-container" mb={4}>
                            <CircularProgress style={{ color: '#2d4f8f' }} />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" className="error-alert" mb={4}>
                            {error}
                        </Alert>
                    ) : (
                        <ServiceList services={filteredServices} />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ServicePage;