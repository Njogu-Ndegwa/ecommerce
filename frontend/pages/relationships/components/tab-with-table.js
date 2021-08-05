import { Form, Input, Button, Space, Select, Row, Col, Modal, message, Card, InputNumber, Table , Layout, Menu} from 'antd';
import { FilterOutlined, DeleteOutlined } from '@ant-design/icons';
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

const { Header, Content, Footer, Sider } = Layout;
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [modalField, setModalField] = useState(undefined);
  const [showOccurenceInput, setShowOccurenceInput] = useState(false);
  const [dataset, setDataset] = useState(false);
  const [column, setColumn] = useState(columns)
  const [selectedgroup, setSelectedGroup] = useState('')


  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const setSecondaryColumn = (appends) => {
    if(appends.length >= 1){
      let str = appends[0].append_type
      let title = appends[0].append_type
      let activity = appends[0].activity_type
      console.log(`did_${activity.split('-').join('_')}`)
    columns.push({
      title: `${title.split('-').join(' ')} ${appends[0].activity_type}`,
      dataIndex: `${str.split('-').join('_')}`,
      key: `${str.split('-').join('_')}`
    })

    columns.push({
      title: `Did ${appends[0].activity_type}`,
      dataIndex: 'did_secondary_activity',
      key: 'did_secondary_activity'
    })
  }
  }

  const onFinish = async ({ appends, filters, primary_activity, measure, occurrence }) => {
    setSecondaryColumn(appends)
    console.log({ appends, filters, primary_activity, measure, occurrence }, 'hello')
    console.log(API_URL)
    const activityTypesResponse = await fetch(API_URL + 'generate-dataset', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appends, filters, primary_activity, measure, occurrence }),
    });
    const activityTypesJson = await activityTypesResponse.json();
      setData(activityTypesJson)
      setDataset(true)
    
  };

  const handleChange = (val) => {
    setShowOccurenceInput(val === 'nth');
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



  const handleOnClickGroupByColumn = async (object) =>{
    setColumn(group_by_columns[object.key]) 
    const customerResponse = await fetch(API_URL + object.key)
    const customerData = await customerResponse.json()
    setData(customerData)
    setSelectedGroup(object.key)
  }


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
        {dataset && <PlotChart data={data} columns={column} />}
        <Card title="Activities" style={{marginBottom: "40px"}} >
      <Menu
        mode="vertical" onClick={(object) => handleOnClickGroupByColumn(object)}>
<SubMenu key="sub1" title="Activity Id"  >
          <Menu.Item key="group_by_activityid" >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub2" title="Timestamp" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_timestamp"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub3" title="Source"  onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_source"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub4" title="Source_id" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_sourceid"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub5" title="Customer" onClick={(item) => handleOnClickGroupByColumn(item)} >
          <Menu.Item key="group_by_customer">Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub6" title="activity" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_activity" >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub7" title="feature_1" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_feature1"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub8" title="feature_2" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_feature2"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub9" title="feature_3" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_feature3"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub10" title="revenue_impact" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_revenue_impact"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub11" title="link" onClick={(object) => handleOnClickGroupByColumn(object)}>
          <Menu.Item key="group_by_link"  >Only Column</Menu.Item>
          <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
</SubMenu>
      </Menu>
      </Card>
      <Card title="Occurence Info" style={{marginBottom: "40px"}} >
      <Menu
        mode="vertical"
        // style={{ height: '50%' }}
      >
        <SubMenu key="sub12" title="Activity Id" onClick={(item) => handleOnClickGroupByColumn(item)} >
        <Menu.Item key="group_by_activityid" >Only Column</Menu.Item>
        <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
        </SubMenu>
        <SubMenu key="sub13" title="Occurence" onClick={(item) => handleOnClickGroupByColumn(item)}>
        <Menu.Item key="group_by_occurence"  >Only Column</Menu.Item>
        <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
        </SubMenu>
        <SubMenu key="sub14" title="Activity Repeated at" onClick={(item) => handleOnClickGroupByColumn(item)} >
        <Menu.Item key="group_by_activity_repeated_at" >Only Column</Menu.Item>
        <Menu.Item key="day">Day</Menu.Item>
          <Menu.Item key="week">Week</Menu.Item>
          <Menu.Item key="month">Month</Menu.Item>
          <Menu.Item key="year">Year</Menu.Item>
        </SubMenu>
      </Menu>
      </Card>
    </Sider>
    <Content style={{ padding: '0 24px', minHeight: 280 }}>
    {dataset? <Card className="custom-card" title="Results"  bordered={false}>
              <Table size="small" rowKey="activity_id" scroll={{x: 400}} columns={column} dataSource={data} />
            </Card> :
            <Card className="custom-card" title="Dataset Generation" bordered={false}>
              <p className="spacer-bottom">Relationship define how you append activities to your dataset</p>
              <InlineForm form={form} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
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
                                      <Select showSearch style={{ minWidth: 128 }} options={appendTypes} />
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
                          <PrimaryButtonPurple style={{ marginLeft: 10 }} htmlType="submit">
                            Generate Dataset
                          </PrimaryButtonPurple>
                        </div>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </InlineForm>
            </Card>}
      </Content>
      </Layout>
      </Content>
     </Layout>
  );
};

export default Relationships
