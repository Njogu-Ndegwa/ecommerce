import { Form, Input, Button, Space, Select, Row, Col, Modal, message, Card, InputNumber, Table } from 'antd';
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
    console.log({ appends, filters, primary_activity, measure, occurrence}, 'Dennis')
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

  return (
    <Container>
      <RoundedTopCard>
        <Row gutter={12}>
          <Col md={12} sm={12}>
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
            </Card>
          </Col>
          <Col sm={12}>
            <Card
              className="custom-card"
              extra={
                <>
                  <PrimaryButtonPurple>Analyze dataset</PrimaryButtonPurple>
                  <PrimaryButtonPurple style={{ marginLeft: 8 }}>download Dataset</PrimaryButtonPurple>
                </>
              }
              bordered={false}
            ></Card>
          </Col>
        </Row>
      </RoundedTopCard>

      <RoundedTopCard style={{ marginTop: 20 }}>
        <Row gutter={12}>
          <Col md={24} sm={24}>
            <Card className="custom-card" title="Results" bordered={false}>
              <Table size="small" rowKey="activity_id" columns={columns} dataSource={activities} />
            </Card>
          </Col>
        </Row>
      </RoundedTopCard>
    </Container>
  );
};

export default Relationships;
