import { Form, Input, Button, Space, Select, Row, Col, Modal, message, Card, InputNumber, Table , Layout, Menu} from 'antd';
import { FilterOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {
  AppendActivityButton,
  Container,
  InlineForm,
  PrimaryButtonPurple,
  RoundedTopCard,
  SelectWithBackgroundColor,
} from './Styles';
import { useEffect, useState } from 'react';
import { humanize } from '../utils/index';
import Explanation from './Explanation';
import PlusIcon from './PlusIcon';
import ButtonDropdown from './ButtonDropdown';
import NestedFieldArray from './NestedFieldArray';
import moment from 'moment';
import PlotChart from './chart-button'

import {group_by_columns} from './group_by_column_table'
import {column_id} from './column_id'

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const giveMeOptions = [
  { label: 'All', value: 'all' },
  { label: 'First', value: 'first' },
  { label: 'Last', value: 'last' },
  { label: 'Nth', value: 'nth' },
];

const appendTypes = [
  { label: 'First Ever', value: 'first-ever' },
  { label: 'Last Ever', value: 'last-ever' },
  { label: 'First Before', value: 'first-before' },
  { label: 'Last Before', value: 'last-before' },
  { label: 'First Between', value: 'first-between' },
  { label: 'Last Between', value: 'last-between' },
  { label: 'Aggregation All', value: 'aggregation-all' },
];

const columns = [
  {
    title: 'Activity Id',
    dataIndex: 'activity_id',
    key: 'activity_id',
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Activity',
    dataIndex: 'activity',
    render: (activity) => humanize(activity || ''),
    key: 'activity',
  },
  {
    title: 'Timestamp',
    dataIndex: 'ts',
    render: (ts) => moment(ts).format('ll'),
    key: 'ts',
  },

  {
    title: 'Feature1',
    dataIndex: 'feature_1',
    key: 'feature_1',
  },

  {
    title: 'Feature2',
    dataIndex: 'feature_2',
    key: 'feature_2',
  },

  {
    title: 'Feature3',
    dataIndex: 'feature_3',
    key: 'feature_3',
  },

  {
    title: 'Revenue Impact',
    dataIndex: 'revenue_impact',
    key: 'revenue_impact',
  },

  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
  },

  {
    title: 'Occurence',
    dataIndex: 'occurence',
    key: 'occurence',
  },
];

export const customerAttrs = [
  { label: 'Customer', value: 'customer' },
  { label: 'Activity Id', value: 'activity_id' },
  { label: 'Source', value: 'source' },
  { label: 'Source Id', value: 'source_id' },
  { label: 'Feature 1', value: 'feature_1' },
  { label: 'Feature 2', value: 'feature_2' },
  { label: 'Feature 3', value: 'feature_3' },
  { label: 'Link', value: 'link' },
];


const API_URL = "http://localhost:5000/"

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
  const [column, setColumn] = useState(columns)
  const [xAxis, setXAxis] = useState({});
  const [groupedBy, setGroupedBy] = useState({
    primary_activity: '',
    appends: [],
    columns: [],
    columnKey: ''
  });
  
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
  const setSecondaryColumn = appends => {
      // console.log('appends: ', appends);
      if (!appends.length) return;
      const str = appends[0].append_type
      const title = appends[0].append_type
      const activity = appends[0].activity_type
      const dynamColumns = [
        {
          title: `${title.split('-').join(' ')} ${activity.replace(/_/g, ' ')}`,
          dataIndex: `${str.replace(/-/g, '_')}_secondary`,
          key: `${str.split('-').join('_')}`
        },
        {
          title: `Did ${activity.replace(/_/g, ' ')}`,
          dataIndex: 'secondary_activity',
          key: 'did_secondary_activity'
        },
        {
          title: `Days from ${activity.replace(/_/g, ' ')}`,
          dataIndex: 'days_from_secondary_activity',
          key: 'days_from_secondary_activity'
        }
      ];

      // console.log('Cols: ', dynamColumns)
      setColumn([...columns, ...dynamColumns]);
  };

  useEffect(() => {
      // console.log('groupedBy', groupedBy);
      if (groupedBy.columns.length) {
        const primaryActivity = activityTypes
          .filter(v => v.value === groupedBy.primary_activity)
        const appendType = groupedBy.appends[0].append_type.replace(/-/g, ' ');
        const activityType = groupedBy.appends[0].activity_type.replace(/_/g, ' ')

        const dynamColumns = [
          {
            title: `Total ${primaryActivity[0]?.label}`,
            dataIndex: 'total_primary',
            key: groupedBy.primary_activity
          },
          {
            title: `Total ${appendType} ${activityType}`,
            dataIndex: 'total_secondary',
            key: `total_${appendType.replace(/\s/g, '_')}`
          },
          {
            title: `Conversion rate to ${appendType} ${activityType}`,
            dataIndex: 'conversion_rate',
            key: `conversion_rate_to_${appendType}_${activityType}`
          },
          {
            title: `Average days from ${appendType} ${activityType}`,
            dataIndex: 'avarage_days',
            key: `average_days_from_${appendType}_${activityType}`
          }
        ]

        const columns = groupedBy.columns.concat(dynamColumns);
        setColumn(columns);
        // console.log('useEffectColumns: ', columns);
        setXAxis(columns[0]);
        // console.log('columns[0]', columns[0]);
      }
  }, [groupedBy])

  const onFinish = ({ appends, filters, primary_activity, measure, occurrence }) => {
    setSecondaryColumn(appends) 
    setGroupedBy(prev => ({...prev, appends, primary_activity}));
    setIsLoading(true);

    fetch(API_URL + 'generate-dataset', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appends, filters, primary_activity, measure, occurrence }),
    })
    .then(res => res.json())
    .then(data => {
      // console.log('onFinishData: ', data);
      setData(data);
      setDataset(true);
      setIsLoading(false);
    })
    .catch(err => setIsLoading(false));    
  };
  const onFinishFailed = err => console.log('formValidate Error: ',err);

  // Activity type label
  const [activityLabel, setActivityLabel] = useState("Activity")
  useEffect(() => {
    if (activityTypes.length) setActivityLabel(activityTypes[0].label)
  }, [activityTypes]);

  const handleChange = (val) => {
    setShowOccurenceInput(val === 'nth');
    activityTypes.forEach(({label, value}) => {
      if (value === val) setActivityLabel(label)
    });
  };

  useEffect(async () => {
    const activityTypesResponse = await fetch(API_URL + 'activity_types');
    const activityTypesJson = await activityTypesResponse.json();
    setActivityTypes(activityTypesJson.map((x) => ({ label: humanize(x.activity), value: x.activity })));
    form.setFieldsValue({ measure: 'all', appends: [] });
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
    return form.getFieldValue('appends') && form.getFieldValue('appends').length > 0;
  };

  // append state
  const [appendState, setAppendState] = useState('');

  const handleOnClickGroupByColumn = async object => {
    const groupByTime = object.key.split("_")
    let timeEndpoint
    let timePeriod
    if(groupByTime.length === 2) {
      timeEndpoint = column_id[groupByTime[0]]
      timePeriod = groupByTime[1]
      console.log(timePeriod, 'timeperiod')
    } else {
      timePeriod = false
    }
    const columns = group_by_columns[object.key] || group_by_columns[timeEndpoint];
    setColumn(columns)
    setGroupedBy(prev => ({...prev, columns, columnKey: object.key }));
    const period = ['day','week','month','year'];
    const time = period.includes(object.key) && object.key;
    const endpoint = timeEndpoint ? timeEndpoint : !period.includes(object.key) && object.key;


    if (endpoint) {
      const res = await fetch(API_URL + endpoint, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({time: timePeriod, view: appendState})
      });

      const data = await res.json();
      setData(data)
      // console.log('groupByColumn: ', data);
    }
  };

  // handle back navigation 
  const handleBack = () => {
    setColumn(columns);
    setGroupedBy({columns: []});
    setDataset(false);
    setCount(0);
  };

  // handle append onChange event
  const handleAppendChange = value => {
    const view = `${value.replace(/-/g, '_')}_view`;
    setAppendState(view)
  };

  // count down timer in seconds
  const [count, setCount] = useState(0);
  const timer = () => setCount(prev => prev + 0.1);

  useEffect(() => {
    let clearTimer;
    if (isLoading) {
      const id = setInterval(timer, 100);
      clearTimer = () => clearInterval(id);
    }
    return clearTimer;
  }, [isLoading]);

  return (
    <Layout>
    <Content style={{ padding: '0 50px' }}>
    <div>
        <h2>Create New Dataset</h2>
        <h3>{dataset ? "Parent Dataset": "Editing Definitions"}</h3>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: "flex-end", marginTop: hasAppends() ? '1.7rem' : 0 }}>
            <PrimaryButtonPurple>Analyze dataset</PrimaryButtonPurple>
            <PrimaryButtonPurple style={{ marginLeft: 8 }}>download Dataset</PrimaryButtonPurple>
          </div>
        </Form.Item>
    </div>
    <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
    <Sider className="site-layout-background" style={{width: 200, backgroundColor:"#EEEEEE"}} >
          {dataset && <PlotChart data={data} columns={column} xAxis = {xAxis} />}
          <Card title={activityLabel} style={{marginBottom: "40px"}} >
        <Menu
          mode="vertical" onClick={(object) => handleOnClickGroupByColumn(object)}>
    <SubMenu key="sub1" title="Activity Id" >
            <Menu.Item key="group_by_activityid" >Only Column</Menu.Item>
            <Menu.Item key="id_day">Day</Menu.Item>
            <Menu.Item key="id_week">Week</Menu.Item>
            <Menu.Item key="id_month">Month</Menu.Item>
            <Menu.Item key="id_year">Year</Menu.Item>
    </SubMenu>
    <SubMenu key="sub2" title="Timestamp" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_timestamp"  >Only Column</Menu.Item>
            <Menu.Item key="ts_day">Day</Menu.Item>
            <Menu.Item key="ts_week">Week</Menu.Item>
            <Menu.Item key="ts_month">Month</Menu.Item>
            <Menu.Item key="ts_year">Year</Menu.Item>
    </SubMenu>
    <SubMenu key="sub3" title="Source"  onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_source"  >Only Column</Menu.Item>
            <Menu.Item key="sc_day">Day</Menu.Item>
            <Menu.Item key="sc_week">Week</Menu.Item>
            <Menu.Item key="sc_month">Month</Menu.Item>
            <Menu.Item key="sc_year">Year</Menu.Item>
    </SubMenu>
    <SubMenu key="sub4" title="Source_id" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_sourceid"  >Only Column</Menu.Item>
            <Menu.Item key="scid_day">Day</Menu.Item>
            <Menu.Item key="scid_week">Week</Menu.Item>
            <Menu.Item key="scid_month">Month</Menu.Item>      
            <Menu.Item key="scid_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub5" title="Customer" onClick={(item) => handleOnClickGroupByColumn(item)} >
            <Menu.Item key="group_by_customer">Only Column</Menu.Item>
            <Menu.Item key="cu_day">Day</Menu.Item>
            <Menu.Item key="cu_week">Week</Menu.Item>
            <Menu.Item key="cu_month">Month</Menu.Item>
            <Menu.Item key="cu_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub6" title="activity" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_activity" >Only Column</Menu.Item>
            <Menu.Item key="ac_day">Day</Menu.Item>
            <Menu.Item key="ac_week">Week</Menu.Item>
            <Menu.Item key="ac_month">Month</Menu.Item>
            <Menu.Item key="ac_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub7" title="feature_1" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_feature1"  >Only Column</Menu.Item>
            <Menu.Item key="f1_day">Day</Menu.Item>
            <Menu.Item key="f1_week">Week</Menu.Item>
            <Menu.Item key="f1_month">Month</Menu.Item>
            <Menu.Item key="f1_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub8" title="feature_2" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_feature2"  >Only Column</Menu.Item>
            <Menu.Item key="f2_day">Day</Menu.Item>
            <Menu.Item key="f2_week">Week</Menu.Item>
            <Menu.Item key="f2_month">Month</Menu.Item>
            <Menu.Item key="f2_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub9" title="feature_3" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_feature3"  >Only Column</Menu.Item>
            <Menu.Item key="f3_day">Day</Menu.Item>
            <Menu.Item key="f3_week">Week</Menu.Item>
            <Menu.Item key="f3_month">Month</Menu.Item>
            <Menu.Item key="f3_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub10" title="revenue_impact" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_revenue_impact"  >Only Column</Menu.Item>
            <Menu.Item key="re_day">Day</Menu.Item>
            <Menu.Item key="re_week">Week</Menu.Item>
            <Menu.Item key="re_month">Month</Menu.Item>
            <Menu.Item key="re_year">Year</Menu.Item>
  </SubMenu>
  <SubMenu key="sub11" title="link" onClick={(object) => handleOnClickGroupByColumn(object)}>
            <Menu.Item key="group_by_link"  >Only Column</Menu.Item>
            <Menu.Item key="li_day">Day</Menu.Item>
            <Menu.Item key="li_week">Week</Menu.Item>
            <Menu.Item key="li_month">Month</Menu.Item>
            <Menu.Item key="li_year">Year</Menu.Item>
  </SubMenu>
        </Menu>
        </Card>
        <Card title="Occurence Info" style={{marginBottom: "40px"}} >
        <Menu
          mode="vertical"
        >
          {/* <SubMenu key="sub12" title="Activity Id" onClick={(item) => handleOnClickGroupByColumn(item)} > */}
          {/* <Menu.Item key="group_by_activityid" >Only Column</Menu.Item>
          { MenuItem } 
          */}
          {/* </SubMenu>  */}
          <SubMenu key="sub13" title="Occurence" onClick={(item) => handleOnClickGroupByColumn(item)}>
          <Menu.Item key="group_by_occurence"  >Only Column</Menu.Item>
            <Menu.Item key="oc_day">Day</Menu.Item>
            <Menu.Item key="oc_week">Week</Menu.Item>
            <Menu.Item key="oc_month">Month</Menu.Item>
            <Menu.Item key="oc_year">Year</Menu.Item>
          </SubMenu>
          <SubMenu key="sub14" title="Activity Repeated at" onClick={(item) => handleOnClickGroupByColumn(item)} >
          <Menu.Item key="group_by_activity_repeated_at" >Only Column</Menu.Item>
            <Menu.Item key="at_day">Day</Menu.Item>
            <Menu.Item key="at_week">Week</Menu.Item>
            <Menu.Item key="at_month">Month</Menu.Item>
            <Menu.Item key="at_year">Year</Menu.Item>
          </SubMenu>
        </Menu>
        </Card>
      </Sider>
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
      {       
              dataset ? 
              <Card 
                bordered={false}
                className="custom-card" 
                title={
                  <span>
                    <ArrowLeftOutlined onClick={handleBack} style={{fontSize: '18px'}}/>
                    &nbsp;&nbsp;Results
                  </span>
                }
              >
                <Table size="small" rowKey="activity_id" scroll={{x: 400}} columns={column} dataSource={data} />
              </Card> :
              <Card className="custom-card" title="Dataset Generation" bordered={false}>
                <p className="spacer-bottom">Relationship define how you append activities to your dataset</p>
                <InlineForm form={form} name="dynamic_form_nest_item" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
                  <Modal
                    okButtonProps={{ style: { borderColor: '#7865bf', backgroundColor: '#7865bf' } }}
                    closable={false}
                    width={'50%'}
                    visible={isModalVisible2}
                    cancelButtonProps={{ className: 'main-border' }}
                    onOk={() => {
                      const appends = form.getFieldValue('appends');
                      const filters = form.getFieldValue(modalField.name);
                      appends[modalField.name] = { ...appends[modalField.name], ...filters };

                      form.setFieldsValue({
                        appends: appends,
                        filters: form.getFieldValue('filters') || [],
                      });

                      handleOk2();
                    }}
                    onCancel={handleCancel}
                  >
                    {modalField && (
                      <NestedFieldArray
                        fieldProps={{
                          ...modalField,
                          name: [modalField.name, 'filters'],
                          fieldKey: [modalField.fieldKey, 'filters'],
                        }}
                        form={form}
                      />
                    )}
                  </Modal>

                  <Modal
                    okButtonProps={{ style: { borderColor: '#7865bf', backgroundColor: '#7865bf' } }}
                    closable={false}
                    width={'50%'}
                    visible={isModalVisible}
                    cancelButtonProps={{ className: 'main-border' }}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <NestedFieldArray fieldProps={{ name: 'filters' }} form={form} />
                  </Modal>

                  <Row gutter={16}>
                    <Col>
                      <Input.Group compact>
                        <label className="input-group-label">
                          <strong>Give me</strong>
                        </label>
                        <Form.Item name="measure">
                          <Select options={giveMeOptions} onChange={handleChange} />
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
                        <SelectWithBackgroundColor
                          style={{ minWidth: '150px' }}
                          options={activityTypes}
                          onChange={handleChange}
                        />
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
                                    prevValues.measure !== curValues.measure || prevValues.appends !== curValues.appends
                                  }
                                >
                                  {() => (
                                    <Input.Group compact>
                                      <label className="input-group-label">Append</label>
                                      <Form.Item
                                        {...field}
                                        name={[field.name, 'append_type']}
                                        fieldKey={[field.fieldKey, 'append_type']}
                                      >
                                        <Select showSearch style={{ minWidth: 128 }} options={appendTypes} onChange={handleAppendChange}/>
                                      </Form.Item>
                                      <Button onClick={() => showFilterModal2(field)}>
                                        <FilterOutlined />
                                      </Button>
                                    </Input.Group>
                                  )}
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'activity_type']}
                                  fieldKey={[field.fieldKey, 'activity_type']}
                                >
                                  <SelectWithBackgroundColor style={{ minWidth: '150px' }} options={activityTypes} />
                                </Form.Item>

                                <Form.Item>
                                  <DeleteOutlined onClick={() => remove(field.name)} />
                                </Form.Item>
                              </Space>
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <div style={{ display: 'flex', marginTop: hasAppends() ? '1.7rem' : 0 }}>
                            <AppendActivityButton onClick={() => add()}>
                              <span>Append Activity</span>
                              <PlusIcon />
                            </AppendActivityButton>
                            {
                              isLoading?
                              <div style={{marginLeft: 10, display: 'inline-block'}}>
                                <Button type='primary' danger loading>
                                  Cancel
                                </Button>
                                <p style={{display: 'inline-block', marginLeft: '1em'}}>
                                  <b>{`${count.toFixed(1)} seconds`}</b>
                                </p>
                              </div>:
                              <PrimaryButtonPurple style={{marginLeft: 10}} htmlType="submit">
                                Generate Dataset
                              </PrimaryButtonPurple>
                            }
                          </div>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </InlineForm>
              </Card>
              }
        </Content>
        </Layout>
        </Content>
      </Layout>
  );
}

export default Relationships
