import React from "react";

import {
  Table,
  Button,
  Space,
  Tag,
  Avatar
} from "antd";

function AdminTable() {

  const columns = [

    {
      title:"USER",
      dataIndex:"name",
      key:"name",

      render:(text)=>(
        <Space>

          <Avatar>
            {text[0]}
          </Avatar>

          {text}

        </Space>
      )
    },

    {
      title:"EMAIL",
      dataIndex:"email",
      key:"email",
    },

    {
      title:"CONTACT",
      dataIndex:"contact",
      key:"contact",
    },

    {
      title:"GENDER",
      dataIndex:"gender",
      key:"gender",
    },

    {
      title:"ADDRESS",
      dataIndex:"address",
      key:"address",
    },

    {
      title:"JOINED",
      dataIndex:"joined",
      key:"joined",
    },

    {
      title:"ORDERS",
      dataIndex:"orders",
      key:"orders",
    },

    {
      title:"STATUS",
      dataIndex:"status",
      key:"status",

      render:(status)=>(

        <Tag
          color={
            status === "Active"
            ? "green"
            : "red"
          }
        >
          {status}
        </Tag>

      )
    },

    {
      title:"ACTIONS",
      key:"actions",

      render:(record)=>(

        <Space>

          <Button size="small">
            View
          </Button>

          {

            record.status === "Active"

            ?

            <Button
              danger
              size="small"
            >
              Block
            </Button>

            :

            <Button
              type="primary"
              size="small"
            >
              Unblock
            </Button>

          }

        </Space>

      )
    }

  ];

  const data = [

    {
      key:"1",
      name:"Arun Kumar",
      email:"arun@gmail.com",
      contact:"+91 98765 43210",
      gender:"Male",
      address:"Gandhi Nagar, Chennai",
      joined:"Jan 2026",
      orders:24,
      status:"Active",
    },

    {
      key:"2",
      name:"Priya Sharma",
      email:"priya@gmail.com",
      contact:"+91 98000 67890",
      gender:"Female",
      address:"Anna Nagar, Chennai",
      joined:"Feb 2026",
      orders:18,
      status:"Active",
    },

    {
      key:"3",
      name:"Raj Patel",
      email:"raj@gmail.com",
      contact:"+91 98003 11223",
      gender:"Male",
      address:"T Nagar, Chennai",
      joined:"Mar 2026",
      orders:7,
      status:"Blocked",
    },

    {
      key:"4",
      name:"Meena Raj",
      email:"meena@gmail.com",
      contact:"+91 98004 77889",
      gender:"Female",
      address:"Velachery, Chennai",
      joined:"Apr 2026",
      orders:32,
      status:"Active",
    },

  ];

  return (

    <Table

      columns={columns}

      dataSource={data}

      pagination={{
        pageSize:5
      }}

    />

  );
}

export default AdminTable;