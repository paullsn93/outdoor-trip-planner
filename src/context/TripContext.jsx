/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
    const [currentTrip, setCurrentTrip] = useState(null);

    const updateTripData = (newData) => {
        setCurrentTrip(prev => ({ ...prev, ...newData }));
    };

    return (
        <TripContext.Provider value={{ currentTrip, setCurrentTrip, updateTripData }}>
            {children}
        </TripContext.Provider>
    );
}

export const useTrip = () => useContext(TripContext);
