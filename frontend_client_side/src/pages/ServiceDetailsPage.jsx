import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../apis/serviceApi';
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    Divider,
    Chip,
    Tooltip
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const ServiceDetailsPage = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSendMessage = async ({item}) => {
        try {

            if (!item.posted_by) {
                throw new Error('Cannot send message: Item poster information is missing');
            }

            const image = item.service_image;
            let imageData = null;

            if (image) {
                try {
                    imageData = {
                        data: btoa(
                            new Uint8Array(image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                        ),
                        contentType: image.contentType,
                        fileName: image.name,
                    };
                } catch (imageError) {
                    console.error('Error processing image:', imageError);
                }
            }

            const response = await fetch(`http://localhost:3000/api/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    receiver: item.posted_by,
                    text: `I am interested in the item: ${item.service_title}`,
                    conversationId: null,
                    image: imageData,
                }),
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Failed to send message');
            }

            alert('Message sent successfully!');
            setTimeout(() => {
                navigate('/chat', { state: { forceRefresh: true } });
            }, 500);
        } catch (error) {
            console.error('Error sending message:', error);
            alert(`Failed to send message: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceById(id);
                setService(data);
                setLoading(false);

                
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!service) {
        return <p>Service not found</p>;
    }

    const handleGoBack = () => {
        console.log(service)
        navigate('/servicePage');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
 <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <img
                        src={service.service_image || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={service.service_title}
                        style={{
                            width: '40%',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '2px',
                            boxShadow: '0 2px 8px rgba(45, 79, 143, 0.07)',
                            marginBottom: '16px',
                            marginLeft: '250px'
                        }}
                    />
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#2d4f8f' }}>
                        {service.service_title}
                    </Typography>
                    {/* <Typography variant="subtitle1" color="text.secondary">
                        Service ID: {id}
                    </Typography> */}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
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

                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Category:</b> {service.service_category}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Listing Type:</b> {service.service_listing_type}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Condition:</b> {service.service_condition}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Pricing Type:</b> {service.service_pricing_type}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Visibility:</b> {service.service_visibility}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>User UNI:</b> {service.user_uni}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Price:</b> {service.service_price}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>User Phone:</b> {service.user_phone}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    <b>Description:</b> {service.service_description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button variant="contained" sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}>
                        Pay
                    </Button>
                    <Button onClick={() => handleSendMessage(service)} variant="contained" sx={{ bgcolor: 'blue', '&:hover': { bgcolor: 'darkblue' } }}>
                        Send Message
                    </Button>
                    <Button variant="outlined" onClick={handleGoBack}>
                        Back to Services
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ServiceDetailsPage;
