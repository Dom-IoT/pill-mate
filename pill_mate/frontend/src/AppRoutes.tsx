import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Calendar from './pages/Calendar.tsx';
import Stock from './pages/Stock.tsx' ;

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
