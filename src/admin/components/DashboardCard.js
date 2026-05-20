import AdminNavbar from "../../components/admin/Adminnavbar";

import Sidebar from "./Sidebar";

import AdminTable from "../../components/admin/AdminTable";

function DashboardCard() {

  return (

    <div
      style={{
        display:"flex"
      }}
    >

      <Sidebar />

      <div
        style={{
          flex:1
        }}
      >

        <AdminNavbar />

        <div
          style={{
            padding:"20px"
          }}
        >

          <h1>Dashboard</h1>

          <AdminTable />

        </div>

      </div>

    </div>
  );
}

export default DashboardCard;