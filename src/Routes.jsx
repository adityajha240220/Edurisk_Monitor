import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import AdminDashboard from "pages/admin-dashboard";
import DataUploadManagement from "pages/data-upload-management";
import MentorDashboard from "pages/mentor-dashboard";
import AuthenticationPortal from "pages/authentication-portal";
import MinistryDashboard from "pages/ministry-dashboard";


const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/data-upload-management" element={<DataUploadManagement />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/authentication-portal" element={<AuthenticationPortal />} />
          <Route path="/ministry-dashboard" element={<MinistryDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
