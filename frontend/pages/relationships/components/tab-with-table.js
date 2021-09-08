import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Select,
  Row,
  Col,
  Modal,
  message,
  Card,
  InputNumber,
  Table,
  Layout,
  Menu,
  Dropdown,
  Tabs
} from "antd";
import {
  FilterOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  AppendActivityButton,
  InlineForm,
  PrimaryButtonPurple,
  SelectWithBackgroundColor,
  ActivityMenuContainer,
  SecondaryActivityMenuContainer,
} from "./Styles";

import { humanize } from "../utils/index";
import PlusIcon from "./PlusIcon";
import NestedFieldArray from "./NestedFieldArray";
import PlotChart from "./chart-button";

import { columns, group_by_columns } from "./group_by_column_table";
import { column_id } from "./column_id";
import CustomDropDown from "../custom_dropdown";
import moment from 'moment'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const giveMeOptions = [
  { label: "All", value: "all" },
  { label: "First", value: "first" },
  { label: "Last", value: "last" },
  { label: "Nth", value: "nth" },
];

const appendTypes = [
  { label: "First Ever", value: "first-ever" },
  { label: "Last Ever", value: "last-ever" },
  { label: "First Before", value: "first-before" },
  { label: "Last Before", value: "last-before" },
  { label: "First Between", value: "first-between" },
  { label: "Last Between", value: "last-between" },
  { label: "Aggregation All", value: "aggregation-all" },
];

export const customerAttrs = [
  { label: "Customer", value: "customer" },
  { label: "Activity Id", value: "activity_id" },
  { label: "Source", value: "source" },
  { label: "Source Id", value: "source_id" },
  { label: "Feature 1", value: "feature_1" },
  { label: "Feature 2", value: "feature_2" },
  { label: "Feature 3", value: "feature_3" },
  { label: "Link", value: "link" },
];

const API_URL = "http://localhost:5000/";
const {TabPane} = Tabs
const Relationships = () => {
  const [form] = Form.useForm();

  const [activityTypes, setActivityTypes] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [modalField, setModalField] = useState(undefined);

  const [showOccurenceInput, setShowOccurenceInput] = useState(false);
  const [dataset, setDataset] = useState(false);
  const [column, setColumn] = useState(columns);
  const [xAxis, setXAxis] = useState({});
  const [groupedBy, setGroupedBy] = useState({
    primary_activity: "",
    appends: [],
    columns: [],
  });
  const [selectedPrimaryActivity, setSelectedPrimaryActivity] = useState({
    label: "Select an Activity",
    value: "",
  });
  const [selectedSecondaryActivity, setSelectedSecondaryActivity] = useState({
    label: "Select an Activity",
    value: "",
  });
  const [isprimaryActivitySelected, setisPrimaryActivitySelected] =
    useState(false);
  const [issecondaryActivitySelected, setisSecondaryActivitySelected] =
    useState(false);
  const [panes, setPanes] = useState([]);
  const [activeKey, setActiveKey] = useState('0');
  const [newTabIndex, setNewTabIndex] = useState(0);

  // count down timer in seconds
  const [count, setCount] = useState(0);
  const timer = () => setCount((prev) => prev + 0.1);
  const [onFinishCalled, setOnfinishCalled] = useState(false)
  const [groupbyColumnCalled, setGroupbyColumnCalled] = useState(false)
  const [groupByTabTitle, setgroupByTabTitle] = useState('')
  const [timeColumn, setTimeColumn] = useState('')

  useEffect(() => {
    let clearTimer;
    if (isLoading) {
      const id = setInterval(timer, 100);
      clearTimer = () => clearInterval(id);
    }
    return clearTimer;
  }, [isLoading]);

  // modal logic
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  // Update dynamic fields
  const setSecondaryColumn = (appends) => {
    // console.log('appends: ', appends);
    const str = appends[0].append_type;
    const title = appends[0].append_type;
    const activity = appends[0].activity_type;
    const dynamColumns = [
      {
        title: `${title.split("-").join(" ")} ${activity.replace(/_/g, " ")}`,
        dataIndex: `${str.replace(/-/g, "_")}_secondary`,
        key: `${str.split("-").join("_")}`,
      },
      {
        title: `Did ${activity.replace(/_/g, " ")}`,
        dataIndex: "secondary_activity",
        key: "did_secondary_activity",
      },
      {
        title: `Days from ${activity.replace(/_/g, " ")}`,
        dataIndex: "days_from_secondary_activity",
        key: "days_from_secondary_activity",
      },
    ];
    // console.log('Cols: ', dynamColumns)
    setColumn([...columns, ...dynamColumns]);
    console.log(data, "while setting dynamic columns")
  };
  // useEffect groupedBy dynamic fields
  useEffect(() => {
    console.log(timeColumn, "Time Column")
    if (groupedBy.columns.length) {
      const primaryActivity = activityTypes.filter(
        (v) => v.value === groupedBy.primary_activity
      );
      const appendType = groupedBy.appends[0].append_type.replace(/-/g, " ");
      const activityType = groupedBy.appends[0].activity_type.replace(
        /_/g,
        " "
      );

      const dynamicTimeColumn = [
        {
          title: `${humanize(timeColumn)}`,
          dataIndex: `${timeColumn}`,
          render:(timeColumn) => moment(timeColumn).format('ll'),
          key: timeColumn
        },
      ]
      const dynamColumns = [
        {
          title: `Total ${primaryActivity[0]?.label}`,
          dataIndex: "total_primary",
          key: groupedBy.primary_activity,
        },
        {
          title: `Total ${appendType} ${activityType}`,
          dataIndex: "total_secondary",
          key: `total_${appendType.replace(/\s/g, "_")}`,
        },
        {
          title: `Conversion rate to ${appendType} ${activityType}`,
          dataIndex: "conversion_rate",
          key: `conversion_rate_to_${appendType}_${activityType}`,
        },
        {
          title: `Average days from ${appendType} ${activityType}`,
          dataIndex: "avarage_days",
          key: `average_days_from_${appendType}_${activityType}`,
        },
      ];


      if(timeColumn){
        const columns = [...dynamicTimeColumn, ...groupedBy.columns, ...dynamColumns]
        setColumn(columns);
        setXAxis(columns[0]);
        setTimeColumn('')
      }
      else {
        const columns = groupedBy.columns.concat(dynamColumns);
        setColumn(columns);
        setXAxis(columns[0]);
      }
      // setColumn(columns);
      // console.log('useEffectColumns: ', columns);
      // setXAxis(columns[0]);
      // console.log('columns[0]', columns[0]);
    }
  }, [groupedBy]);

  const onFinish = ({ appends, filters, measure, occurrence }) => {
    const primary_activity = selectedPrimaryActivity["value"];
    if(selectedSecondaryActivity["value"]){
      const secondary_activity = selectedSecondaryActivity["value"];
      appends[0]["activity_type"] = secondary_activity;
    }
    
    console.log({
      appends: appends,
      filters: filters,
      primary_activity: primary_activity,
      measure: measure,
      occurence: occurrence,
    });
    if (appends.length) {
      setSecondaryColumn(appends);
      setGroupedBy((prev) => ({ ...prev, appends, primary_activity }));
    }
    setIsLoading(true);
    fetch(API_URL + "generate-dataset", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appends,
        filters,
        primary_activity,
        measure,
        occurrence,
      }),
    })
      .then((res) => res.json())
      .then((value) => {
        console.log("onFinishData: ", value);
        setData(value);
        setDataset(true);
        setIsLoading(false);
        setOnfinishCalled(true)
        
      })
      .catch((err) => setIsLoading(false));
      console.log('On finish Called')
  };

  const onFinishFailed = (err) => console.log("formValidate Error: ", err);

  // Activity type label
  const [activityLabel, setActivityLabel] = useState("");
  const [secondaryActivityLabel, setSecondaryActivityLabel] = useState("");
  // useEffect(() => {
  //   if (activityTypes.length) setActivityLabel(activityTypes[0].label);
  // }, [activityTypes]);

  const handlePrimaryActivityChange = (val) => {
    typeof val === "string" && setActivityLabel(val);
    setShowOccurenceInput(val === "nth");
    activityTypes.forEach(({ label, value }) => {
      if (value === val["key"]) {
        setSelectedPrimaryActivity({ label: label, value: value });
        setisPrimaryActivitySelected(true);
      }
    });
  };

  const handleSecondaryActivityChange = (val) => {
    console.log(val);
    typeof val === "string" &&
      setSecondaryActivityLabel(humanize(val.split("-").join(" ")));
    activityTypes.forEach(({ label, value }) => {
      if (value === val["key"]) {
        setSelectedSecondaryActivity({ label: label, value: value });
        setisSecondaryActivitySelected(true);
      }
    });
    appendTypes.forEach(({ label, value }) => {
      if (value === val) {
        console.log(val);
        const view = `${value.replace(/-/g, "_")}_view`;
        setAppendState(view);
      }
    });
  };

  useEffect(async () => {
    const activityTypesResponse = await fetch(API_URL + "activity_types");
    const activityTypesJson = await activityTypesResponse.json();
    console.log(activityTypesJson);
    setActivityTypes(
      activityTypesJson.map((x) => ({
        label: humanize(x.activity),
        value: x.activity,
        feature_1: x.feature_1 ? humanize(x.feature_1) : "",
        feature_2: x.feature_2 ? humanize(x.feature_2) : "",
        feature_3: x.feature_3 ? humanize(x.feature_3) : "",
      }))
    );
    form.setFieldsValue({ measure: "all", appends: [] });
  }, []);

  useEffect(async () => {
    if (activityTypes.length > 0) {
      form.setFieldsValue({
        primary_activity: activityTypes[0].value,
        appends: [],
      });
    }
  }, [activityTypes]);

  const showFilterModal = () => {
    setIsModalVisible(true);
  };
  const showFilterModal2 = (fieldName) => {
    setIsModalVisible2(true);
    setModalField(fieldName);
  };

  const hasAppends = () => {
    return (
      form.getFieldValue("appends") && form.getFieldValue("appends").length > 0
    );
  };

  // append state
  const [appendState, setAppendState] = useState("");

  const handleOnClickGroupByColumn = (object) => {
    console.log(object.key)
    const groupByTime = object.key.split("_");
    let timeEndpoint;
    let timePeriod;
    if (groupByTime.length === 2) {
      timeEndpoint = column_id[groupByTime[0]];
      timePeriod = groupByTime[1];
      if(timeEndpoint !== 'group_by_timestamp'){
        setTimeColumn(timePeriod)
      } 
    } else {
      timePeriod = false;
    }

    if (!groupedBy.appends.length) return message.error("Append an activity!");
    const columns =
      group_by_columns[object.key] || group_by_columns[timeEndpoint];
      console.log({"object.key": object.key, "timeEndpoint": timeEndpoint})
    setColumn(columns);
    setGroupedBy((prev) => ({ ...prev, columns }));
    setIsLoading(true);

    const period = ["day", "week", "month", "year"];
    const endpoint = timeEndpoint
      ? timeEndpoint
      : !period.includes(object.key) && object.key;

    if (endpoint) {
      fetch(API_URL + endpoint, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time: timePeriod, view: appendState }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "group by data")
          const tabtitle = humanize(object['key'].split('_').slice(1).join(' '))
          setgroupByTabTitle(tabtitle)
          setData(data);
          setIsLoading(false);
          setGroupbyColumnCalled(true)
          // tabAdd(data, tabtitle, columns)
        })
        .catch((err) => setIsLoading(false));
    }
  };

  // handle back navigation
  const handleBack = () => {
    setColumn(columns);
    setDataset(false);
    setCount(0);
    setGroupedBy({ columns: [] });
  };

  // handle append onChange event
  const handleAppendChange = (value) => {
    console.log(value);
    const view = `${value.replace(/-/g, "_")}_view`;
    setAppendState(view);
  };

  const primaryActivityMenu = (
    <Menu onClick={(key) => handlePrimaryActivityChange(key)}>
      {activityTypes
        ? activityTypes.map((item) => (
            <Menu.Item key={item.value}>
              <div>
                <h4>
                  {" "}
                  <strong>{item.label} </strong>{" "}
                </h4>
                <p>features:</p>
                <div
                  style={{
                    display: "flex",
                    marginTop: "-20px",
                    padding: 0,
                    fontWeight: "500",
                  }}
                >
                  <p>{item.feature_1}</p>{" "}
                  <p style={{ paddingLeft: "10px" }}>{item.feature_2}</p>{" "}
                  <p style={{ paddingLeft: "10px" }}>{item.feature_3}</p>
                </div>
              </div>
            </Menu.Item>
          ))
        : ""}
    </Menu>
  );

  const secondaryActivityMenu = (
    <Menu onClick={(key) => handleSecondaryActivityChange(key)}>
      {activityTypes
        ? activityTypes.map((item) => (
            <Menu.Item key={item.value}>
              <div>
                <h4>
                  {" "}
                  <strong>{item.label} </strong>{" "}
                </h4>
                <p>features:</p>
                <div
                  style={{
                    display: "flex",
                    marginTop: "-20px",
                    padding: 0,
                    fontWeight: "500",
                  }}
                >
                  <p>{item.feature_1}</p>{" "}
                  <p style={{ paddingLeft: "10px" }}>{item.feature_2}</p>{" "}
                  <p style={{ paddingLeft: "10px" }}>{item.feature_3}</p>
                </div>
              </div>
            </Menu.Item>
          ))
        : ""}
    </Menu>
  );

  const primaryActivityTitle =
    activityLabel &&
    selectedPrimaryActivity["label"] !== "Select an Activity" ? (
      <div>
        <h5 style={{ fontWeight: "400" }}>{activityLabel}</h5>
        <h4>{selectedPrimaryActivity["label"]}</h4>
      </div>
    ) : (
      selectedPrimaryActivity["label"]
    );

  const secondaryActivityTitle =
    secondaryActivityLabel &&
    selectedSecondaryActivity["label"] !== "Select an Activity" ? (
      <div>
        <h5 style={{ fontWeight: "400" }}>{secondaryActivityLabel}</h5>
        <h4>{selectedSecondaryActivity["label"]}</h4>
      </div>
    ) : (
      selectedSecondaryActivity["label"]
    );

  const onTabChange = (activeKey) => {
    setActiveKey(activeKey);
  };

  const onTabEdit = (targetKey, action) => {
    console.log(action)
    if (action === "add") {
      tabAdd(targetKey);
    } else if (action === "remove") {
      tabRemove(targetKey);
    }
  };

  const tabAdd = (title) => {
    let tabTitle
    if(groupbyColumnCalled) {
      tabTitle = groupByTabTitle
    }
    else if(onFinishCalled) {
      tabTitle = title
    }
    const activeKey = `newTab${newTabIndex}`;
    console.log(activeKey);
    const newPanes = [...panes];
    newPanes.push({
      title: tabTitle,
      content: <Table
      size="small"
      rowKey="activity_id"
      scroll={{ x: 400 }}
      columns={column}
      dataSource={data}
    />,
      key: activeKey,
    });
    setPanes(newPanes);
    setActiveKey(activeKey);
    setNewTabIndex((prevTabIndex) => prevTabIndex + 1);
  };

  const tabRemove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setPanes(newPanes);
    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    if(data && onFinishCalled){
      let title = "Parent"
      tabAdd(title)
      setOnfinishCalled(false)
    }
  },[data, column, onFinishCalled])

  useEffect(() => {
    console.log(groupbyColumnCalled)
    if(data && groupbyColumnCalled){
      tabAdd()
    }
    setGroupbyColumnCalled(false)
  },[data, column, groupbyColumnCalled])
  return (
    <Layout>
      <Content style={{ padding: "0 2.5em" }}>
        <div>
          <h2>Create New Dataset</h2>
          <h3>{dataset ? "Parent Dataset" : "Editing Definitions"}</h3>
        </div>
        <div style={{ margin: ".5em 0" }}>
          <div style={{ width: "25em", marginLeft: "auto" }}>
            <PrimaryButtonPurple
              className="primary-button-purple"
              style={{ display: "inline-block" }}
            >
              Analyze dataset
            </PrimaryButtonPurple>
            <PrimaryButtonPurple
              className="primary-btn-purple"
              style={{ marginLeft: ".5em", display: "inline-block" }}
            >
              Download dataset
            </PrimaryButtonPurple>
          </div>
        </div>
        <Layout className="site-layout-background">
          <Sider
            className="site-layout-background"
            style={{ width: 300, backgroundColor: "#EEEEEE" }}
          >
            {dataset && (
              <PlotChart
                data={data}
                columns={column}
                xAxis={xAxis}
                isLoading={isLoading}
                count={count}
              />
            )}

            <Card
              title={primaryActivityTitle}
              style={{ marginBottom: "1em", minHeight: 290, width: 300 }}
            >
              {isprimaryActivitySelected ? (
                <ActivityMenuContainer className="activity-menu-container">
                  <Menu
                    mode="vertical"
                    onClick={(object) => handleOnClickGroupByColumn(object)}
                  >
                    <SubMenu key="sub1" title="Activity Id">
                      <Menu.Item key="group_by_activityid">
                        Only Column
                      </Menu.Item>
                      <Menu.Item key="id_day">Day</Menu.Item>
                      <Menu.Item key="id_week">Week</Menu.Item>
                      <Menu.Item key="id_month">Month</Menu.Item>
                      <Menu.Item key="id_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub2"
                      title="Timestamp"
                    >
                      <Menu.Item key="group_by_timestamp">
                        Only Column
                      </Menu.Item>
                      <Menu.Item key="ts_day">Day</Menu.Item>
                      <Menu.Item key="ts_week">Week</Menu.Item>
                      <Menu.Item key="ts_month">Month</Menu.Item>
                      <Menu.Item key="ts_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub3"
                      title="Source"
                      
                    >
                      <Menu.Item key="group_by_source">Only Column</Menu.Item>
                      <Menu.Item key="sc_day">Day</Menu.Item>
                      <Menu.Item key="sc_week">Week</Menu.Item>
                      <Menu.Item key="sc_month">Month</Menu.Item>
                      <Menu.Item key="sc_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub4"
                      title="Source_id"
                    >
                      <Menu.Item key="group_by_sourceid">Only Column</Menu.Item>
                      <Menu.Item key="scid_day">Day</Menu.Item>
                      <Menu.Item key="scid_week">Week</Menu.Item>
                      <Menu.Item key="scid_month">Month</Menu.Item>
                      <Menu.Item key="scid_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub5"
                      title="Customer"
                      
                    >
                      <Menu.Item key="group_by_customer">Only Column</Menu.Item>
                      <Menu.Item key="cu_day">Day</Menu.Item>
                      <Menu.Item key="cu_week">Week</Menu.Item>
                      <Menu.Item key="cu_month">Month</Menu.Item>
                      <Menu.Item key="cu_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub6"
                      title="activity"
                      
                    >
                      <Menu.Item key="group_by_activity">Only Column</Menu.Item>
                      <Menu.Item key="ac_day">Day</Menu.Item>
                      <Menu.Item key="ac_week">Week</Menu.Item>
                      <Menu.Item key="ac_month">Month</Menu.Item>
                      <Menu.Item key="ac_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub7"
                      title="feature_1"
                      
                    >
                      <Menu.Item key="group_by_feature1">Only Column</Menu.Item>
                      <Menu.Item key="f1_day">Day</Menu.Item>
                      <Menu.Item key="f1_week">Week</Menu.Item>
                      <Menu.Item key="f1_month">Month</Menu.Item>
                      <Menu.Item key="f1_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub8"
                      title="feature_2"
                      
                    >
                      <Menu.Item key="group_by_feature2">Only Column</Menu.Item>
                      <Menu.Item key="f2_day">Day</Menu.Item>
                      <Menu.Item key="f2_week">Week</Menu.Item>
                      <Menu.Item key="f2_month">Month</Menu.Item>
                      <Menu.Item key="f2_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub9"
                      title="feature_3"
                      
                    >
                      <Menu.Item key="group_by_feature3">Only Column</Menu.Item>
                      <Menu.Item key="f3_day">Day</Menu.Item>
                      <Menu.Item key="f3_week">Week</Menu.Item>
                      <Menu.Item key="f3_month">Month</Menu.Item>
                      <Menu.Item key="f3_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub10"
                      title="revenue_impact"
                      
                    >
                      <Menu.Item key="group_by_revenue_impact">
                        Only Column
                      </Menu.Item>
                      <Menu.Item key="re_day">Day</Menu.Item>
                      <Menu.Item key="re_week">Week</Menu.Item>
                      <Menu.Item key="re_month">Month</Menu.Item>
                      <Menu.Item key="re_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub11"
                      title="link"
                      
                    >
                      <Menu.Item key="group_by_link">Only Column</Menu.Item>
                      <Menu.Item key="li_day">Day</Menu.Item>
                      <Menu.Item key="li_week">Week</Menu.Item>
                      <Menu.Item key="li_month">Month</Menu.Item>
                      <Menu.Item key="li_year">Year</Menu.Item>
                    </SubMenu>
                  </Menu>
                </ActivityMenuContainer>
              ) : (
                ""
              )}
            </Card>
            {issecondaryActivitySelected ? (
              <Card
                title={secondaryActivityTitle}
                style={{ marginBottom: "40px", width: 300 }}
              >
                <SecondaryActivityMenuContainer>
                  <Menu mode="vertical">
                    <SubMenu
                      key="sub13"
                      title={`${secondaryActivityLabel} ${selectedSecondaryActivity["label"]} Timestamp`}
                      onClick={(item) => handleOnClickGroupByColumn(item)}
                    >
                      <Menu.Item key="group_by_occurence">
                        Only Column
                      </Menu.Item>
                      <Menu.Item key="oc_day">Day</Menu.Item>
                      <Menu.Item key="oc_week">Week</Menu.Item>
                      <Menu.Item key="oc_month">Month</Menu.Item>
                      <Menu.Item key="oc_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub14"
                      title={`Did ${selectedSecondaryActivity["label"]}`}
                      
                    >
                      <Menu.Item key="group_by_activity_repeated_at">
                        Only Column
                      </Menu.Item>
                      <Menu.Item key="at_day">Day</Menu.Item>
                      <Menu.Item key="at_week">Week</Menu.Item>
                      <Menu.Item key="at_month">Month</Menu.Item>
                      <Menu.Item key="at_year">Year</Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub15"
                      title={`Days to ${selectedSecondaryActivity["label"]}`}
                      
                    >
                      <Menu.Item key="group_by_activity_repeated_at">
                        Only Column
                      </Menu.Item>
                      <Menu.Item key="at_day">Day</Menu.Item>
                      <Menu.Item key="at_week">Week</Menu.Item>
                      <Menu.Item key="at_month">Month</Menu.Item>
                      <Menu.Item key="at_year">Year</Menu.Item>
                    </SubMenu>
                  </Menu>
                </SecondaryActivityMenuContainer>
              </Card>
            ) : (
              ""
            )}
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            {dataset ? (
              <Card
                style={{ width: "65vw", marginLeft: 100 }}
                bordered={false}
                className="custom-card"
                title={
                  <span>
                    <ArrowLeftOutlined
                      onClick={handleBack}
                      style={{ fontSize: "18px" }}
                    />
                    &nbsp;&nbsp;Results
                  </span>
                }
              >
                {/* <Table
                  size="small"
                  rowKey="activity_id"
                  scroll={{ x: 400 }}
                  columns={column}
                  dataSource={data}
                /> */}
                <Tabs
                  type="editable-card"
                  onChange={onTabChange}
                  activeKey={activeKey}
                  onEdit={onTabEdit}
                >
                  {panes.map((pane) => (
                    <TabPane
                      tab={pane.title}
                      key={pane.key}
                      closable={pane.closable}
                    >
                      {pane.content}
                    </TabPane>
                  ))}
                </Tabs>
              </Card>
            ) : (
              <Card
                className="custom-card"
                title="Dataset Generation"
                bordered={false}
                style={{ width: "64vw", marginLeft: 100 }}
              >
                <p className="spacer-bottom">
                  Relationship define how you append activities to your dataset
                </p>
                <InlineForm
                  form={form}
                  name="dynamic_form_nest_item"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Modal
                    okButtonProps={{
                      style: {
                        borderColor: "#7865bf",
                        backgroundColor: "#7865bf",
                      },
                    }}
                    closable={false}
                    width={"50%"}
                    visible={isModalVisible2}
                    cancelButtonProps={{ className: "main-border" }}
                    onOk={() => {
                      const appends = form.getFieldValue("appends");
                      const filters = form.getFieldValue(modalField.name);
                      appends[modalField.name] = {
                        ...appends[modalField.name],
                        ...filters,
                      };

                      form.setFieldsValue({
                        appends: appends,
                        filters: form.getFieldValue("filters") || [],
                      });

                      handleOk2();
                    }}
                    onCancel={handleCancel}
                  >
                    {modalField && (
                      <NestedFieldArray
                        fieldProps={{
                          ...modalField,
                          name: [modalField.name, "filters"],
                          fieldKey: [modalField.fieldKey, "filters"],
                        }}
                        form={form}
                      />
                    )}
                  </Modal>

                  <Modal
                    okButtonProps={{
                      style: {
                        borderColor: "#7865bf",
                        backgroundColor: "#7865bf",
                      },
                    }}
                    closable={false}
                    width={"50%"}
                    visible={isModalVisible}
                    cancelButtonProps={{ className: "main-border" }}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <NestedFieldArray
                      fieldProps={{ name: "filters" }}
                      form={form}
                    />
                  </Modal>

                  <Row gutter={16}>
                    <Col>
                      <Input.Group compact>
                        <Form.Item label={<b>Give me</b>} />
                        <Form.Item name="measure">
                          <Select
                            options={giveMeOptions}
                            onChange={handlePrimaryActivityChange}
                            style={{ width: "5em" }}
                          />
                        </Form.Item>
                        {showOccurenceInput && (
                          <Form.Item name="occurrence">
                            <InputNumber />
                          </Form.Item>
                        )}
                        <Button onClick={showFilterModal}>
                          <FilterOutlined />
                        </Button>
                      </Input.Group>
                    </Col>
                    <Col>
                      <Form.Item name="primary_activity" label="">
                        {/* <SelectWithBackgroundColor
                      className='select-with-bg-color'
                      style={{ minWidth: '150px' }}
                      options={activityTypes}
                      onChange={handlePrimaryActivityChange}
                    /> */}
                        <Dropdown overlay={primaryActivityMenu}>
                          <Button
                            style={{
                              width: 150,
                              backgroundColor: "#7865bf !important",
                              border: "1px solid #7865bf !important",
                              color: "white",
                            }}
                            icon={<DownOutlined />}
                          >
                            {selectedPrimaryActivity["label"]}
                          </Button>
                        </Dropdown>
                      </Form.Item>
                    </Col>
                    <Form.Item label="">
                      <b>activities...</b>
                    </Form.Item>
                  </Row>

                  <Form.List name="appends">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Row key={field.key}>
                            <Col span={24}>
                              <Space align="start">
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prevValues, curValues) =>
                                    prevValues.measure !== curValues.measure ||
                                    prevValues.appends !== curValues.appends
                                  }
                                >
                                  {() => (
                                    <Input.Group compact>
                                      <Form.Item label={<b>Append</b>} />
                                      <Form.Item
                                        {...field}
                                        name={[field.name, "append_type"]}
                                        fieldKey={[
                                          field.fieldKey,
                                          "append_type",
                                        ]}
                                      >
                                        <Select
                                          showSearch
                                          style={{ minWidth: 128 }}
                                          options={appendTypes}
                                          onChange={
                                            handleSecondaryActivityChange
                                          }
                                        />
                                      </Form.Item>
                                      <Button
                                        onClick={() => showFilterModal2(field)}
                                      >
                                        <FilterOutlined />
                                      </Button>
                                    </Input.Group>
                                  )}
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "activity_type"]}
                                  fieldKey={[field.fieldKey, "activity_type"]}
                                >
                                  {/* <SelectWithBackgroundColor
                                    style={{ minWidth: "150px" }}
                                    options={activityTypes}
                                  /> */}
                                  <Dropdown overlay={secondaryActivityMenu}>
                                    <Button
                                      style={{
                                        width: 150,
                                        backgroundColor: "blue",
                                        border: "1px solid blue",
                                        color: "white",
                                      }}
                                      icon={<DownOutlined />}
                                    >
                                      {selectedSecondaryActivity["label"]}
                                    </Button>
                                  </Dropdown>
                                </Form.Item>

                                <Form.Item>
                                  <DeleteOutlined
                                    onClick={() => remove(field.name)}
                                  />
                                </Form.Item>
                              </Space>
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <div style={{ display: "flex" }}>
                            <AppendActivityButton
                              className="append-activity-btn"
                              onClick={() => add()}
                            >
                              Append Activity
                              <PlusIcon />
                            </AppendActivityButton>
                            {isLoading ? (
                              <div
                                style={{
                                  marginLeft: 10,
                                  display: "inline-block",
                                }}
                              >
                                <Button type="primary" danger loading>
                                  Cancel
                                </Button>
                                <p
                                  style={{
                                    display: "inline-block",
                                    marginLeft: "1em",
                                  }}
                                >
                                  <b>{`${count.toFixed(1)} seconds`}</b>
                                </p>
                              </div>
                            ) : (
                              <PrimaryButtonPurple
                                className="primary-btn-purple"
                                style={{ marginLeft: 10 }}
                                htmlType="submit"
                              >
                                Generate Dataset
                              </PrimaryButtonPurple>
                            )}
                          </div>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </InlineForm>
              </Card>
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Relationships;
