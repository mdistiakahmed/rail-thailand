'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { createFilenameFromRoute } from '@/utils/stringutils';

export const RouteSearch: React.FC<any> = ({ startStation, routes }) => {
  const router = useRouter();
  const [destinationStation, setDestinationStation] = useState('');

  // Get available destinations from routes
  const availableDestinations = routes
    .filter((route: string) => route.startsWith(`${startStation} - `))
    .map((route: string) => route.split(' - ')[1])
    .filter(Boolean);

  const handleSearch = () => {
    if (destinationStation) {
      // Find matching route
      const matchingRoute = routes.find((route: string) => {
        const [routeStart, routeEnd] = route.split(' - ');
        return routeStart === startStation && routeEnd === destinationStation;
      });
      
      if (matchingRoute) {
        const slug = createFilenameFromRoute(matchingRoute);
        const startStationSlug = startStation.toLowerCase().replace(/\s+/g, '-');
        router.push(`/stations/${startStationSlug}/${slug}`);
      } else {
        alert('No direct route found to this destination. Please try a different destination.');
      }
    } else {
      alert('Please enter a destination station');
    }
  };

  const handleInputChange = (value: string) => {
    setDestinationStation(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <Typography variant="h5" className="mb-6 text-center">
        Search Routes from {startStation}
      </Typography>
      
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Typography variant="body2" className="text-gray-600 mb-2">
            From: <span className="font-semibold">{startStation}</span>
          </Typography>
        </div>

        <div className="mb-6">
          <Autocomplete
            freeSolo
            options={availableDestinations}
            inputValue={destinationStation}
            onInputChange={(_, value) => handleInputChange(value)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="To Station" 
                variant="outlined"
                fullWidth
                placeholder="Enter destination station"
              />
            )}
            renderOption={(props, option: string) => (
              <Box component="li" {...props}>
                {option}
              </Box>
            )}
          />
        </div>

        <div className="text-center">
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSearch}
            startIcon={<FaSearch />}
            className="px-8"
          >
            Search Route
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            {destinationStation 
              ? `Will search for direct route from ${startStation} to ${destinationStation}`
              : "Enter a destination station to search"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteSearch;