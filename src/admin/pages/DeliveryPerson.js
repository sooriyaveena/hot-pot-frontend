import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import AdminNavbar from "../components/Adminnavbar";

import "../styles/DeliveryPerson.css";

import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Avatar,
  Input,
  Button,
  Modal,
  message,
  Popconfirm,
  Select
} from "antd";

import {
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CarOutlined
} from "@ant-design/icons";

function DeliveryPerson() {

  const [deliveryPersons, setDeliveryPersons] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [vehicleType, setVehicleType] =
    useState("");

  const [vehicleNumber, setVehicleNumber] =
    useState("");

  const [available, setAvailable] =
    useState(true);

  useEffect(() => {

    fetchDeliveryPersons();

  }, []);

  const fetchDeliveryPersons = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/delivery/all",
        {

          method: "GET",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`

          }

        }
      );

      const data =
        await response.json();

      if (!data.success) {

        message.error(
          "Failed To Fetch Delivery Persons"
        );

        return;

      }

      const formattedData =
        data.data.map((person) => ({

          key: person.deliveryId,

          name:
            person.name || "No Name",

          phone:
            person.phone || "No Phone",

          vehicle:
            person.vehicleType || "No Vehicle",

          vehicleNumber:
            person.vehicleNumber ||
            "No Number",

          status:
            person.available
              ? "AVAILABLE"
              : "BUSY"

        }));

      setDeliveryPersons(
        formattedData
      );

    }

    catch (error) {

      console.log(error);

      message.error(
        "Error Fetching Delivery Persons"
      );

    }

  };

  const addDeliveryPerson = async () => {

    if (

      name === "" ||

      phone === "" ||

      vehicleType === "" ||

      vehicleNumber === ""

    ) {

      message.error(
        "Please Fill All Fields"
      );

      return;

    }

    if (!/^[0-9]{10}$/.test(phone)) {

      message.error(
        "Phone Number Must Be 10 Digits"
      );

      return;

    }

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/delivery/save",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`

          },

          body: JSON.stringify({

            name,

            phone,

            vehicleType,

            vehicleNumber,

            available

          })

        }
      );

      const data =
        await response.json();

      console.log(data);

      if (response.ok && data.success) {

        message.success(
          "Delivery Person Added"
        );

        fetchDeliveryPersons();

        setName("");

        setPhone("");

        setVehicleType("");

        setVehicleNumber("");

        setAvailable(true);

        setOpenModal(false);

      }

      else {

        message.error(
          data.message ||
          "Failed To Add"
        );

      }

    }

    catch (error) {

      console.log(error);

      message.error(
        "Server Error"
      );

    }

  };

  const deleteDeliveryPerson = async (
    id
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/delivery/delete/${id}`,
        {

          method: "DELETE",

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }
      );

      if (!response.ok) {

        message.error(
          "Delete Failed"
        );

        return;

      }

      message.success(
        "Delivery Person Deleted"
      );

      fetchDeliveryPersons();

    }

    catch (error) {

      console.log(error);

      message.error(
        "Error Deleting Delivery Person"
      );

    }

  };

  const filteredDeliveryPersons =
    deliveryPersons.filter(
      (person) => {

        return (

          person.name
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            )

          ||

          person.phone
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            )

          ||

          person.vehicleNumber
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            )

        );

      }
    );

  const availableCount =
    deliveryPersons.filter(
      (p) =>
        p.status === "AVAILABLE"
    ).length;

  const busyCount =
    deliveryPersons.filter(
      (p) =>
        p.status === "BUSY"
    ).length;

  const columns = [

    {
      title:
        "DELIVERY PERSON",

      dataIndex:
        "name",

      render: (text) => (

        <Space>

          <Avatar
            style={{
              background:
                "#ff6b00"
            }}
          >
            {text[0]}
          </Avatar>

          {text}

        </Space>
      )
    },

    {
      title:
        "PHONE",

      dataIndex:
        "phone"
    },

    {
      title:
        "VEHICLE",

      dataIndex:
        "vehicle"
    },

    {
      title:
        "VEHICLE NUMBER",

      dataIndex:
        "vehicleNumber"
    },

    {
      title:
        "STATUS",

      dataIndex:
        "status",

      render: (status) => (

        <Tag
          color={
            status ===
            "AVAILABLE"

              ? "green"

              : "orange"
          }
        >
          {status}
        </Tag>
      )
    },

    {
      title:
        "ACTION",

      render: (_, record) => (

        <Popconfirm

          title="Delete Delivery Person?"

          description="Are you sure?"

          okText="Yes"

          cancelText="No"

          onConfirm={() =>
            deleteDeliveryPerson(
              record.key
            )
          }
        >

          <Button danger>
            Delete
          </Button>

        </Popconfirm>

      )
    }

  ];

  return (

    <div className="deliveryperson-container">

      <Sidebar />

      <div className="deliveryperson-main">

        <AdminNavbar />

        <div className="deliveryperson-content">

          <div className="deliveryperson-header">

            <div>

              <p className="deliveryperson-text">
                MANAGE
              </p>

              <h1 className="deliveryperson-title">
                DELIVERY PERSONS
              </h1>

            </div>

            <Button

              type="primary"

              icon={<PlusOutlined />}

              onClick={() =>
                setOpenModal(true)
              }

            >
              Add Delivery Person

            </Button>

          </div>

          <Row
            gutter={20}
            className="stats-row"
          >

            <Col span={12}>

              <Card className="deliveryperson-card green-top">

                <CheckCircleOutlined className="deliveryperson-icon" />

                <h1>
                  {availableCount}
                </h1>

                <p>
                  Available Delivery Persons
                </p>

              </Card>

            </Col>

            <Col span={12}>

              <Card className="deliveryperson-card orange-top">

                <CarOutlined className="deliveryperson-icon" />

                <h1>
                  {busyCount}
                </h1>

                <p>
                  Busy Delivery Persons
                </p>

              </Card>

            </Col>

          </Row>

          <Card className="deliveryperson-table-card">

            <Input

              size="large"

              placeholder="Search by name, phone or vehicle number"

              prefix={
                <SearchOutlined />
              }

              value={searchText}

              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }

              style={{
                marginBottom:
                  "20px"
              }}

            />

            <Table

              columns={columns}

              dataSource={
                filteredDeliveryPersons
              }

              pagination={{
                pageSize: 5
              }}

            />

          </Card>

          <Modal

            open={openModal}

            footer={null}

            title="Add Delivery Person"

            onCancel={() =>
              setOpenModal(false)
            }

          >

            <Input

              placeholder="Name"

              className="modal-input"

              value={name}

              onChange={(e) =>
                setName(
                  e.target.value
                )
              }

            />

            <Input

              placeholder="Phone"

              className="modal-input"

              value={phone}

              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }

            />

            <Select

              placeholder="Select Vehicle Type"

              className="modal-input"

              style={{
                width: "100%",
                marginBottom: "15px"
              }}

              value={vehicleType}

              onChange={(value) =>
                setVehicleType(value)
              }

              options={[

                {
                  value: "Bike",
                  label: "Bike"
                },

                {
                  value: "Scooter",
                  label: "Scooter"
                },

                {
                  value: "Car",
                  label: "Car"
                }

              ]}

            />

            <Input

              placeholder="Vehicle Number"

              className="modal-input"

              value={vehicleNumber}

              onChange={(e) =>
                setVehicleNumber(
                  e.target.value
                )
              }

            />

            <Button

              type="primary"

              block

              className="submit-btn"

              onClick={
                addDeliveryPerson
              }

            >
              Save Delivery Person

            </Button>

          </Modal>

        </div>

      </div>

    </div>

  );
}
export default DeliveryPerson;