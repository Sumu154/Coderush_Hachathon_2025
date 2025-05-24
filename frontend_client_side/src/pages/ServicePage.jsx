import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
//import AppNavbar from '../components/Navbar';
import ServiceFilters from './ServiceFilters'; // Create this similar to ItemFilters
import ServiceList from '../components/allCards/ServiceList'; // Create this similar to ItemsList
import { useLocation } from 'react-router-dom';
import '../components/css/ServicePage.css';

const ServicePage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    const keywordParam = queryParams.get('keyword');

    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [searchQuery, setSearchQuery] = useState(keywordParam || '');
    const [filters, setFilters] = useState({
        category: categoryParam || '',
        minPrice: '',
        maxPrice: '',
        negotiable: false,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [services, filters, sortOption, searchQuery]);

    useEffect(() => {
        setSearchQuery(keywordParam || '');
        setFilters(prev => ({
            ...prev,
            category: categoryParam || ''
        }));
    }, [categoryParam, keywordParam]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            // Direct URL, not using API_BASE_URL
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

    const applyFiltersAndSort = () => {
        let filtered = [...services];

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(service =>
                service.service_title.toLowerCase().includes(query) ||
                (service.service_category && service.service_category.toLowerCase().includes(query))
            );
        }

        // Apply category filter
        if (filters.category) {
            filtered = filtered.filter(service =>
                service.service_category &&
                service.service_category.toLowerCase().includes(filters.category.toLowerCase())
            );
        }

        // Apply price range filters
        if (filters.minPrice) {
            filtered = filtered.filter(service => Number(service.service_price) >= Number(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(service => Number(service.service_price) <= Number(filters.maxPrice));
        }

        // Apply negotiable filter
        if (filters.negotiable) {
            filtered = filtered.filter(service =>
                service.service_pricing_type &&
                service.service_pricing_type.toLowerCase().includes('negotiable')
            );
        }

        // Apply sorting
        switch (sortOption) {
            case 'name_asc':
                filtered.sort((a, b) => a.service_title.localeCompare(b.service_title));
                break;
            case 'name_desc':
                filtered.sort((a, b) => b.service_title.localeCompare(a.service_title));
                break;
            case 'price_asc':
                filtered.sort((a, b) => Number(a.service_price) - Number(b.service_price));
                break;
            case 'price_desc':
                filtered.sort((a, b) => Number(b.service_price) - Number(a.service_price));
                break;
            case 'date_asc':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'date_desc':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                // Default sort: newest first
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        setFilteredServices(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters });
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <>
            
           <div className='mt-24'>
             <Box className="content item-content" display="flex" justifyContent="center" alignItems="center" flexDirection="column" mb={6}>

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
                                    <SearchIcon sx={{ color: '#556b2f' }} />
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
                                    borderColor: '#556b2f',
                                }
                            }
                        }}
                    />
                </Box>

                {/* main services showing */}
                <Box className="main-container" width="100%" maxWidth="1200px" mb={4}>
                    <ServiceFilters
                        className=''
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                    />

                    {loading ? (
                        <Box className="loading-container" mb={4}>
                            <CircularProgress style={{ color: '#556b2f' }} />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" className="error-alert" mb={4}>
                            {error}
                        </Alert>
                    ) : (
                        <ServiceList
                            services={filteredServices}
                        />
                    )}
                </Box>
            </Box>
           </div>
        </>
    );
};

export default ServicePage;