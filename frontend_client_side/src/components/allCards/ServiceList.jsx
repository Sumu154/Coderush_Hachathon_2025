import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import ServiceCard from './ServiceCard'; // Adjust the import path as necessary

const ServiceList = ({ services }) => {
    if (!services || services.length === 0) {
        return (
            <Box className="listings-section no-results">
                <Typography variant="h6">
                    No services found matching your criteria.
                </Typography>
            </Box>
        );
    }

    return (
        <div className='w-[75%] '>
            <Box className="listings-section w-full ">
                <Grid className='w-full ' container spacing={1}>
                    {services.map((service) => (
                        <Grid className=' w-full' item key={service._id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
};

export default ServiceList;