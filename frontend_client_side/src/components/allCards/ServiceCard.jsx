import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Tooltip,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/services/${service._id}`);
    };

    return (
        <Card
            className="service-card-horizontal"
            sx={{
                height: 'auto',
                mb: 2,
                borderRadius: 3,
                boxShadow: '0 4px 24px rgba(45, 79, 143, 0.08)',
                transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.01)',
                    boxShadow: '0 8px 32px rgba(45, 79, 143, 0.16)',
                },
                background: 'linear-gradient(90deg, #f8fbff 60%, #eaf1fb 100%)'
            }}
        >
            <Grid container sx={{ height: '100%' }}>
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            height: { xs: '180px', md: '220px' },
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(45, 79, 143, 0.07)'
                        }}
                    >
                        <CardMedia
                            component="img"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderRadius: 2,
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.04)'
                                }
                            }}
                            image={service.service_image || 'https://via.placeholder.com/300x200?text=No+Image'}
                            alt={service.service_title}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                        <Typography
                            variant="h5"
                            component="h3"
                            className="service-title"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: '#2d4f8f',
                                letterSpacing: 0.2,
                                mb: 1
                            }}
                        >
                            {service.service_title}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mb: 1.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <b>Category:</b> {service.service_category} &nbsp;|&nbsp;
                                <b>Listing:</b> {service.service_listing_type} &nbsp;|&nbsp;
                                <b>Condition:</b> {service.service_condition}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <b>Pricing:</b> {service.service_pricing_type} &nbsp;|&nbsp;
                                <b>Visibility:</b> {service.service_visibility}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <b>User UNI:</b> {service.user_uni}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <b>Price:</b> {service.service_price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <b>User Phone:</b> {service.user_phone}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            <Tooltip title="Category" arrow>
                                <Chip
                                    icon={<CategoryIcon />}
                                    label={service.service_category}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#f0f3f9',
                                        color: '#2d4f8f',
                                        fontWeight: 500
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="Visibility" arrow>
                                <Chip
                                    icon={<VisibilityIcon />}
                                    label={service.service_visibility}
                                    size="small"
                                    variant="outlined"
                                />
                            </Tooltip>
                            <Tooltip title="Price" arrow>
                                <Chip
                                    icon={<PriceChangeIcon />}
                                    label={service.service_price}
                                    size="small"
                                    variant="outlined"
                                />
                            </Tooltip>
                            <Tooltip title="User UNI" arrow>
                                <Chip
                                    icon={<AssignmentIndIcon />}
                                    label={service.user_uni}
                                    size="small"
                                    variant="outlined"
                                />
                            </Tooltip>
                            <Tooltip title="Phone" arrow>
                                <Chip
                                    icon={<PhoneIcon />}
                                    label={service.user_phone}
                                    size="small"
                                    variant="outlined"
                                />
                            </Tooltip>
                        </Box>

                        <Button
                            variant="contained"
                            size="medium"
                            onClick={handleViewDetails}
                            sx={{
                                bgcolor: "#2d4f8f",
                                '&:hover': {
                                    bgcolor: '#1e3a6a',
                                },
                                minWidth: '120px',
                                mt: 2,
                                borderRadius: 2,
                                fontWeight: 600,
                                letterSpacing: 0.5
                            }}
                        >
                            View Details
                        </Button>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ServiceCard;