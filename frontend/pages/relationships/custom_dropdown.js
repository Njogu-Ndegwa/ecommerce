import React, { useState, useEffect } from "react";
import { Select, Dropdown, Menu, Button, Input } from "antd";
const { Option } = Select;
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { humanize } from "./utils/index";

const API_URL = "http://localhost:5000/";
export default function customDropdown() {
  const [activityTypes, setActivityTypes] = useState([]);

  useEffect(async () => {
    const activityTypesResponse = await fetch(API_URL + "activity_types");
    const activityTypesJson = await activityTypesResponse.json();
    setActivityTypes(
      activityTypesJson.map((x) => ({
        label: humanize(x.activity),
        value: x.activity,
        feature_1: x.feature_1 ? humanize(x.feature_1) : "",
        feature_2: x.feature_2 ? humanize(x.feature_2) : "",
        feature_3: x.feature_3 ? humanize(x.feature_3) : "",
      }))
    );
  }, []);
  const handleClick = (a) => {
    console.log(a);
  };
  console.log(activityTypes);
  const menu1 = (
    <Menu onClick={(key) => handleClick(key) } >
      {activityTypes
        ? activityTypes.map((item) => (
            <Menu.Item key={item.value}>
              <div>
                <h4> <strong>{item.label} </strong> </h4>
                <p>features:</p>
                <div
                  style={{ display: "flex", marginTop: "-20px", padding: 0, fontWeight:'500'}}
                >
                  <p>{item.feature_1}</p> <p style={{ paddingLeft: "10px" }}>{item.feature_2}</p> <p style={{ paddingLeft: "10px" }}>{item.feature_3}</p>
                </div>
              </div>
            </Menu.Item>
          ))
        : ""}
    </Menu>
  );
  return (
    <>
      <Dropdown overlay={menu1}>
        <Button style={{ width: 150, backgroundColor:'#7865bf !important', border:'1px solid #7865bf !important', color:'white' }} icon={<DownOutlined/>} >Select an Activity</Button>
      </Dropdown>
    </>
  );
}
