import { useState } from 'react';
import { Row, Col, Form, Select, AutoComplete } from 'antd';
import activities from '../mocks/activities';
import {
  DefaultButton,
  FadedText,
  FilterContainer,
  FilterTable,
  Th,
  Td,
  FilterHeader,
  MediumFormItem,
  RoundedDatePicker,
  RoundedSelect,
  SortSwitch,
  Tr,
  UserEmail,
  PrimaryButton,
} from './Styles';
import { isEmpty, humanize, fuzzyMatchSimple } from '../../../relations/utils';
import customers from '../mocks/customers';

const Filter = ({ descSort, setDescSort, form, setActivityList, onSubmitForm }) => {
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [customer, setCustomer] = useState();

  const onChange = (checked) => {
    setDescSort(checked);
  };

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const handleSearch = (value) => {
    if (isEmpty(value)) {
      setAutocompleteOptions([]);
    } else {
      const customersFromCustomersTable = customers.map(x => x.name);
      const customersFromActivitiesTable = activities.map((x) => x.customer);
      const customerNames = [...customersFromCustomersTable, ...customersFromActivitiesTable].filter(onlyUnique);

      setAutocompleteOptions(
        customerNames.map((name) => {
          const matching = fuzzyMatchSimple(name, value);
          return {
            value: name,
            label: matching ? <div className="highlight" dangerouslySetInnerHTML={{ __html: matching }} /> : name,
          };
        })
      );
    }
  };

  const onSelect = (value) => {
    onSubmitForm({ ...form.getFieldsValue(), query: value });
  };

  return (
    <FilterContainer>
      <FilterHeader>Customer Journey</FilterHeader>
      <Form form={form} onFinish={onSubmitForm}>
        <MediumFormItem name="query">
          <AutoComplete
            options={autocompleteOptions}
            placeholder="Enter customer"
            onSelect={onSelect}
            onSearch={handleSearch}
            filterOption={(inputValue, option) => {
              return fuzzyMatchSimple(option.value, inputValue);
            }}
          />
        </MediumFormItem>

        <MediumFormItem name="activity">
          <RoundedSelect placeholder="All activities">
            {['', 'email', 'completed_order'].map((item) => (
              <Select.Option value={item} key={item}>
                {item ? humanize(item) : 'All activities'}
              </Select.Option>
            ))}
          </RoundedSelect>
        </MediumFormItem>

        <Row gutter={8}>
          <Col sm={16}>
            <MediumFormItem bottom="0" name="date_time">
              <RoundedDatePicker showTime placeholder="Activity start date/time" />
            </MediumFormItem>
            <FadedText>Defaults to today</FadedText>
          </Col>
          <Col sm={8}>
            <SortSwitch checked={descSort} checkedChildren="Desc" unCheckedChildren="Asc" onChange={onChange} />
          </Col>
        </Row>
        <PrimaryButton htmlType="submit">Submit</PrimaryButton>
        <DefaultButton
          onClick={() => {
            form.resetFields();
            setActivityList(activities);
            setCustomer(undefined);
          }}
        >
          Reset
        </DefaultButton>
      </Form>
      {customer && (
        <>
          <UserEmail>{customer.name}</UserEmail>
          <FilterTable>
            <tbody>
              <Tr>
                <Th>Company Name</Th>
                <Td>{customer.company_name}</Td>
              </Tr>
              <Tr>
                <Th>City</Th>
                <Td>{customer.city}</Td>
              </Tr>
              <Tr>
                <Th>Home Type</Th>
                <Td>{customer.country}</Td>
              </Tr>
              <Tr>
                <Th>Address</Th>
                <Td>{customer.address}</Td>
              </Tr>
              <Tr>
                <Th>Contact Title</Th>
                <Td>{customer.contact_title}</Td>
              </Tr>
              <Tr>
                <Th>Phone</Th>
                <Td>{customer.phone}</Td>
              </Tr>
              <Tr>
                <Th>Fax</Th>
                <Td>{customer.fax}</Td>
              </Tr>
            </tbody>
          </FilterTable>
        </>
      )}
    </FilterContainer>
  );
};

export default Filter;
