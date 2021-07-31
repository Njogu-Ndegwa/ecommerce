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
  const [activities, setActivities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [modalField, setModalField] = useState(undefined);
  const [showOccurenceInput, setShowOccurenceInput] = useState(false);
  const [dataset, setDataset] = useState(false);
  const [column, setColumn] = useState('')

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

  const onFinish = async ({ appends, filters, primary_activity, measure, occurrence }) => {
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
      setActivities(activityTypesJson)
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
    console.log(fieldName)
    setIsModalVisible2(true);
    setModalField(fieldName);
  };

  const hasAppends = () => {
    return form.getFieldValue('appends') && form.getFieldValue('appends').length > 0;
  };

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
  ];

  const handleOnClickGroupByColumn = async (object) =>{
    console.log(object.key)
    const customerResponse = await fetch(API_URL + object.key)
    const customerData = await customerResponse.json()
    console.log(customerData,"body")
  }


  return (


<Layout>
<Content style={{ padding: '0 50px' }}>
    
<div>
      <h2>Create New Dataset</h2>
      <h3>{dataset ? "Parent Dataset": "Editing Definitions"}</h3>
  </div>
  <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
  <Sider className="site-layout-background" style={{width: 200, backgroundColor:"#EEEEEE"}} >
        {dataset && <PlotChart/>}
        <Card title="Activities" style={{marginBottom: "40px"}} >
      <Menu
        mode="vertical">
<SubMenu key="sub1" title="Activity Id">
          <Menu.Item key="group_by_activityid" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="2">Day</Menu.Item>
          <Menu.Item key="3">Week</Menu.Item>
          <Menu.Item key="4">Month</Menu.Item>
          <Menu.Item key="5">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub2" title="Timestamp">
          <Menu.Item key="group_by_timestamp" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="7">Day</Menu.Item>
          <Menu.Item key="8">Week</Menu.Item>
          <Menu.Item key="9">Month</Menu.Item>
          <Menu.Item key="10">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub3" title="Source" >
          <Menu.Item key="group_by_source" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="12">Day</Menu.Item>
          <Menu.Item key="13">Week</Menu.Item>
          <Menu.Item key="14">Month</Menu.Item>
          <Menu.Item key="15">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub4" title="Source_id">
          <Menu.Item key="group_by_sourceid" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="17">Day</Menu.Item>
          <Menu.Item key="18">Week</Menu.Item>
          <Menu.Item key="19">Month</Menu.Item>
          <Menu.Item key="20">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub5" title="Customer">
          <Menu.Item onClick={(item) => handleOnClickGroupByColumn(item)} key="group_by_customer">Only Column</Menu.Item>
          <Menu.Item key="22">Day</Menu.Item>
          <Menu.Item key="23">Week</Menu.Item>
          <Menu.Item key="24">Month</Menu.Item>
          <Menu.Item key="25">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub6" title="activity">
          <Menu.Item key="group_by_activity" onClick={(object) => handleOnClickGroupByColumn(object)}>Only Column</Menu.Item>
          <Menu.Item key="27">Day</Menu.Item>
          <Menu.Item key="28">Week</Menu.Item>
          <Menu.Item key="29">Month</Menu.Item>
          <Menu.Item key="30">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub7" title="feature_1">
          <Menu.Item key="group_by_feature1" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="32">Day</Menu.Item>
          <Menu.Item key="33">Week</Menu.Item>
          <Menu.Item key="34">Month</Menu.Item>
          <Menu.Item key="35">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub8" title="feature_2">
          <Menu.Item key="group_by_feature2" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="37">Day</Menu.Item>
          <Menu.Item key="38">Week</Menu.Item>
          <Menu.Item key="39">Month</Menu.Item>
          <Menu.Item key="40">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub9" title="feature_3">
          <Menu.Item key="group_by_feature3" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="42">Day</Menu.Item>
          <Menu.Item key="43">Week</Menu.Item>
          <Menu.Item key="44">Month</Menu.Item>
          <Menu.Item key="45">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub10" title="revenue_impact">
          <Menu.Item key="group_by_revenue_impact" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="47">Day</Menu.Item>
          <Menu.Item key="48">Week</Menu.Item>
          <Menu.Item key="49">Month</Menu.Item>
          <Menu.Item key="50">Year</Menu.Item>
</SubMenu>
<SubMenu key="sub11" title="link">
          <Menu.Item key="group_by_link" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="52">Day</Menu.Item>
          <Menu.Item key="53">Week</Menu.Item>
          <Menu.Item key="54">Month</Menu.Item>
          <Menu.Item key="55">Year</Menu.Item>
</SubMenu>
      </Menu>
      </Card>
      <Card title="Occurence Info" style={{marginBottom: "40px"}} >
      <Menu
        mode="vertical"
        // style={{ height: '50%' }}
      >
        <SubMenu key="sub12" title="Activity Id">
        <Menu.Item key="group_by_activityid" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="57">Day</Menu.Item>
          <Menu.Item key="58">Week</Menu.Item>
          <Menu.Item key="59">Month</Menu.Item>
          <Menu.Item key="60">Year</Menu.Item>
        </SubMenu>
        <SubMenu key="sub13" title="Occurence">
        <Menu.Item key="61" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="62">Day</Menu.Item>
          <Menu.Item key="63">Week</Menu.Item>
          <Menu.Item key="64">Month</Menu.Item>
          <Menu.Item key="65">Year</Menu.Item>
        </SubMenu>
        <SubMenu key="sub14" title="Activity Repeated at">
        <Menu.Item key="66" onClick={(object) => handleOnClickGroupByColumn(object)} >Only Column</Menu.Item>
          <Menu.Item key="67">Day</Menu.Item>
          <Menu.Item key="68">Week</Menu.Item>
          <Menu.Item key="69">Month</Menu.Item>
          <Menu.Item key="70">Year</Menu.Item>
        </SubMenu>
      </Menu>
      </Card>
    </Sider>
    <Content style={{ padding: '0 24px', minHeight: 280 }}>
    {dataset? <Card className="custom-card" title="Results"  bordered={false}>
              <Table size="small" rowKey="activity_id" columns={columns} dataSource={activities} />
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
