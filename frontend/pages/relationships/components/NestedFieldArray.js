import { Col, Form, Input, Row, Select } from 'antd';
import { AppendActivityButton, SelectWithBackgroundColor } from './Styles';
import { FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import PlusIcon from './PlusIcon';

const customerAttrs = [
  { label: 'Customer', value: 'customer' },
  { label: 'Activity Id', value: 'activity_id' },
  { label: 'Source', value: 'source' },
  { label: 'Source Id', value: 'source_id' },
  { label: 'Feature 1', value: 'feature_1' },
  { label: 'Feature 2', value: 'feature_2' },
  { label: 'Feature 3', value: 'feature_3' },
  { label: 'Link', value: 'link' },
];

function NestedFieldArray({ form, fieldProps }) {
  return (
    <Form.List {...fieldProps}>
      {(fields, { add, remove }) => (
        <div>
          {fields.map((field, index) => (
            <Row gutter={16} key={field.key}>
              <Col span={7}>
                <Form.Item
                  {...field}
                  name={[field.name, 'attribute']}
                  fieldKey={[field.fieldKey, 'attribute']}
                  label="Where"
                >
                  <Select options={customerAttrs} />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item {...field} name={[field.name, 'filter_type']} fieldKey={[field.fieldKey, 'filter_type']}>
                  <Select
                    allowClear
                    options={[
                      { value: 'includes', label: 'Includes Only' },
                      { value: 'excludes', label: 'Excludes' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item {...field} name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']}>
                  <Input placeholder="Enter name" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item {...field} name={[field.name, 'join']} fieldKey={[field.fieldKey, 'join']}>
                  <SelectWithBackgroundColor
                    options={[
                      { value: 'and', label: 'And' },
                      { value: 'or', label: 'Or' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <DeleteOutlined onClick={() => remove(field.name)} />
                </Form.Item>
              </Col>
            </Row>
          ))}

          <Form.Item>
            <AppendActivityButton
              className={
                form.getFieldValue('appends') && form.getFieldValue('appends').length > 0 ? 'append-button' : ''
              }
              onClick={() => add()}
            >
              <span>Add New Filter</span>
              <PlusIcon />
            </AppendActivityButton>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
}

export default NestedFieldArray;
