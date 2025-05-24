import React, { useState, useRef } from 'react';
import { TextField, Button, MenuItem, Input, IconButton, Snackbar, Alert, FormControlLabel, Checkbox, Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import '../components/css/add_item.css';
// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const categories = ['Electronics', 'Furniture', 'Books', 'Clothing', 'Other'];

// Map: Click to set marker
const LocationSelector = ({ setItemData }) => {
  useMapEvents({
    click(e) {
      if (e.originalEvent.target.closest('.move-to-current-location-button')) {
        return;
      }
      const { lat, lng } = e.latlng;
      setItemData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          geolocation: { latitude: lat, longitude: lng }
        }
      }));
    }
  });
  return null;
};

// Map: Move to current location button
const MoveToCurrentLocation = ({ setItemData }) => {
  const map = useMap();
  const handleMoveToCurrentLocation = (event) => {
    event.stopPropagation();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 17);
          setItemData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              geolocation: { latitude, longitude }
            }
          }));
        },
        (error) => {
          console.error('Error fetching location:', error);
          alert('Unable to fetch your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };
  return (
    <IconButton
      className="move-to-current-location-button"
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
        padding: '8px',
        width: '40px',
        height: '40px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleMoveToCurrentLocation}
    >
      <MyLocationIcon style={{ color: '#1976d2', fontSize: '22px' }} />
    </IconButton>
  );
};

function AddItemPage() {
  const [itemData, setItemData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    negotiable: false,
    email: '',
    phone: '',
    images: [],
    location: { address: '', geolocation: { latitude: 23.9475, longitude: 90.3792 } }
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setItemData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setItemData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const updateFileInput = (remainingImagesCount) => {
    const dataTransfer = new DataTransfer();
    for (let i = 0; i < remainingImagesCount; i++) {
      const file = new File([""], `image${i}`, {
        type: "image/jpeg",
      });
      dataTransfer.items.add(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setItemData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      updateFileInput(newImages.length);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleImageUpload = (e) => {
    const input = e.target;
    const files = Array.from(input.files).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) {
      alert('Please upload only image files.');
      return;
    }
    const readFiles = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve({
            contentType: file.type,
            name: file.name,
            data: reader.result.split(',')[1],
          });
        };
        reader.onerror = reject;
      });
    });
    Promise.all(readFiles)
      .then((newImages) => {
        setItemData((prev) => {
          const updatedImages = [...prev.images, ...newImages];
          updateFileInput(updatedImages.length);
          return {
            ...prev,
            images: updatedImages
          };
        });
      })
      .catch((error) => console.error('Error processing images:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSnackbar({ open: true, message: 'Item added (local only, no backend)!', severity: 'success' });
    setItemData({
      title: '',
      description: '',
      category: '',
      price: '',
      negotiable: false,
      email: '',
      phone: '',
      images: [],
      location: { address: '', geolocation: { latitude: 23.9475, longitude: 90.3792 } }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <>
      
      <div className="AddItemPage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Title" name="title" value={itemData.title} onChange={handleChange} required />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={itemData.description}
              onChange={handleChange}
              required
            />
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={itemData.category || ''}
              onChange={handleChange}
              required
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', gap: 2 }}>
              <TextField
                sx={{ flex: '0 0 80%' }}
                label="Price"
                name="price"
                type="text"
                value={itemData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
                    setItemData(prev => ({ ...prev, price: value }));
                  }
                }}
                required
                inputProps={{
                  inputMode: 'decimal',
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="negotiable"
                    checked={itemData.negotiable}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Negotiable"
                sx={{ flex: '0 0 auto', mt: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={itemData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              type="tel"
              value={itemData.phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9+\-]*$/.test(value)) {
                  setItemData(prev => ({ ...prev, phone: value }));
                }
              }}
              required
              inputProps={{
                inputMode: 'tel',
              }}
            />
            <TextField fullWidth label="Address" name="location.address" value={itemData.location.address} onChange={handleChange} required />
            <Input
              type="file"
              inputRef={fileInputRef}
              inputProps={{
                multiple: true,
                accept: 'image/*'
              }}
              onChange={handleImageUpload}
            />
            <div className="imageThumbnails">
              {itemData.images.map((image, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    margin: '5px'
                  }}
                >
                  <img
                    src={`data:${image.contentType};base64,${image.data}`}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      width: '20px',
                      height: '20px',
                      padding: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                  >
                    <CloseIcon
                      sx={{
                        fontSize: '14px',
                        color: 'white',
                        '&:hover': {
                          color: '#ff4444'
                        }
                      }}
                    />
                  </IconButton>
                </div>
              ))}
            </div>
            <div style={{ height: '400px', width: '100%', marginTop: '20px', position: 'relative' }}>
              <MapContainer
                center={[itemData.location.geolocation.latitude, itemData.location.geolocation.longitude]}
                zoom={17}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    itemData.location.geolocation.latitude,
                    itemData.location.geolocation.longitude,
                  ]}
                >
                  <Popup>
                    Latitude: {itemData.location.geolocation.latitude.toFixed(4)} <br />
                    Longitude: {itemData.location.geolocation.longitude.toFixed(4)}
                  </Popup>
                </Marker>
                <LocationSelector setItemData={setItemData} />
                <MoveToCurrentLocation setItemData={setItemData} />
              </MapContainer>
            </div>
            <Button variant="contained" color="primary" type="submit">
              Add Item
            </Button>
          </form>
        </div>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderLeft: snackbar.severity === 'success' ? '4px solid #2d4f8f' : undefined,
            '& .MuiAlert-icon': {
              color: snackbar.severity === 'success' ? '#2d4f8f' : undefined
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddItemPage;