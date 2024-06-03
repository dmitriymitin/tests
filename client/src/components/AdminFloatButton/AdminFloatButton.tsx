import React from 'react';
import AdminAddFloatGroup from "./components/AdminAddFloatGroup";
import AdminEditFloatGroup from "./components/AdminEditFloatGroup";
import AdminAddFolderGroup from "./components/AdminAddFolderGroup";

const AdminFloatButton = () => {
  return (
    <>
      <AdminAddFolderGroup/>
      <AdminEditFloatGroup/>
      <AdminAddFloatGroup/>
    </>
  );
};

export default AdminFloatButton;