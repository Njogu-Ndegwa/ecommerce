import styled from 'styled-components';
import { Timeline, Input, Form, DatePicker, Switch, Button, Select, Menu } from 'antd';

const ActivityMenuContainer = styled.div`
  overflow-y: auto;
  height: 40vh;

  ::-webkit-scrollbar {
    width: .8em;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #888; 
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
    cursor: pointer;
  }
`;

const MediumFormItem = styled(Form.Item)`
  margin-bottom: ${({ bottom }) => (bottom ? bottom : '16px')};

  .ant-select-selector {
    border-radius: 4px !important;
  }
`;

const Container = styled.div`
  padding: 16px;
`;

const FilterContainer = styled.div`
  height: 100%;
  background-color: #f5f5f5;
  padding: 20px;
`;

const FilterHeader = styled.h3`
  color: #252525;
`;

const RoundedInput = styled(Input)`
  border-radius: 4px;
`;

const RoundedSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 4px !important;
  }
`;

const RoundedDatePicker = styled(DatePicker)`
  border-radius: 4px;
  width: 100%;
  margin-bottom: 5px;
`;

const SortSwitch = styled(Switch)`
  margin-top: 5px;
  background-color: ${({ checked }) => (checked ? '#4291ca' : '#62ADD8')};
  border-color: ${({ checked }) => (checked ? '#4291ca' : '#62ADD8')};
`;

const FadedText = styled.p`
  color: rgba(0, 0, 0, 0.45);
`;

const PrimaryButton = styled(Button)`
  background-color: #4291ca;
  border-color: #4291ca;
  color: white;
  border-radius: 4px;
  margin-right: 8px;

  &:hover,
  &:active,
  &:focus {
    background-color: #62add8;
    border-color: #62add8;
    color: white;
  }
`;

const DefaultButton = styled(Button)`
  border-radius: 4px;

  &:hover,
  &:active,
  &:focus {
    border-color: #4291ca;
    color: #4291ca;
  }
`;

const UserEmail = styled.h3`
  font-weight: bold;
  font-size: 16px;
  padding-top: 30px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e2e2e2;
`;

const FilterTable = styled.table`
  width: 100%;
  margin-top: 16px;
`;

const PopoverTable = styled.table`
  width: 100%;

  td {
    padding-left: 30px;
  }

  div.ant-typography,
  .ant-typography p {
    margin-bottom: 0 !important;
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid #e2e2e2;

  &:last-child {
    border-bottom: none;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 5px 0px;
`;

const Td = styled.td`
  text-align: left;
  padding: 5px;
`;

const TimeLineContainer = styled.div`
  display: grid;
  grid-template-columns: 0.4fr 1fr;

  .hour-info {
    padding-bottom: 10px;
    display: grid;
    color: rgba(0, 0, 0, 0.45);
    grid-template-columns: 110px 75%;
  }

  .hour-info .right {
    margin-left: -30px;
  }

  .bordered {
    border-left: 1px solid #e2e2e2;
    padding: 24px;
  }

  .date-info {
    flex-basis: 200px;
  }

  .date-info p {
    margin: 0;
    color: rgba(0, 0, 0, 0.45);
    text-align: right;
  }

  .date-info h3 {
    text-align: right;
    font-weight: bold;
    font-size: 20px;
  }
`;

const TimeLineItem = styled(Timeline.Item)`
  .ant-timeline-item-label {
    width: calc(110px - 12px) !important;
  }

  .ant-timeline-item-tail,
  .ant-timeline-item-head {
    left: 110px !important;
  }

  .ant-timeline-item-content {
    width: calc(100% - 150px) !important;
    left: calc(110px - 4px) !important;
    display: grid;
    grid-template-columns: 40px 40% 50%;
    column-gap: 16px;

    p {
      margin: 0 !important;
    }
  }

  &:last-child {
    padding-bottom: 10px !important;
  }
`;

const BadgeSuccess = styled.span`
  margin-left: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #439c5b;
  background-color: #e0f3e4;
  color: #439c5b;
`;

const ActivityNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  min-height: 270px;
`;

const InlineForm = styled(Form)`
  .ant-form-item-label {
    label {
      &::after {
        content: '' !important;
      }
    }
  }
`;

const PrimaryButtonPurple = styled(Button)`
  background-color: #7865bf;
  border: #7865bf;
  color: white;
  text-transform: uppercase;
  font-weight: bold;

  &:hover,
  &:focus {
    color: white;
    background-color: #7865bf;
    border: #7865bf;
  }

  span {
    font-size: 12px;
  }
`;

const AppendActivityButton = styled(Button)`
  display: flex;
  align-items: center;
  border-color: #7865bf;

  span {
    color: #7865bf;

    &:hover {
      color: rgb(116, 113, 242);
    }
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-arrow {
    margin-top: -10px;
  }
`;

const RoundedTopCard = styled.div`
  border-radius: 10px;
  background-color: white;
  padding: 16px 28px;

  .anticon-filter,
  .anticon-filter {
    svg {
      color: rgba(0, 0, 0, 0.85);
    }
    &:hover,
    &:focus {
      svg {
        color: #7865bf;
      }
    }
  }

  .ant-btn:hover,
  .ant-btn:focus,
  .ant-input:focus,
  .ant-input:hover,
  .ant-form-item-control-input-content:hover,
  .ant-input-number:hover,
  .ant-input-number-input:hover,
  .ant-input-number:focus,
  .ant-input-number-focused,
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) {
    border-color: #7865bf;

    .ant-select-selector {
      border-color: #7865bf;
    }
  }

  .ant-select {
    border-color: #7865bf;
  }

  .ant-card-head {
    padding: 0px;
    border-bottom: none;

    .ant-card-head-title {
      padding: 5px 0px;
      font-weight: bold;
    }

    .ant-card-extra {
      padding: 0;
    }
  }

  .ant-card-body {
    padding: 0px;

    .spacer-bottom {
      margin-bottom: 2rem;
    }

    .input-group-label {
      line-height: 32px;
      padding-right: 10px;
    }

    .ant-space-item {
      .ant-form-item {
        margin-bottom: 5px;
      }
    }

    .append-button {
      margin-top: 2rem;
    }
  }

  .ant-modal-footer {
    .ant-btn {
      border-color: #7865bf;
    }
  }
`;
const SelectWithBackgroundColor = styled(Select)`
  .ant-select-selector {
    background-color: #7865bf !important;
    border: 1px solid #7865bf !important;
  }

  .ant-select-arrow,
  .ant-select-selection-item {
    color: white;
    font-weight: bold;
  }
`;

const MainMenu = styled(Menu)`
.menu-style {

  height: 100vh;
  width: 200px;
  position: fixed;
  }
`

export {
  ActivityMenuContainer,
  StyledSelect,
  RoundedTopCard,
  AppendActivityButton,
  SelectWithBackgroundColor,
  FilterTable,
  PopoverTable,
  Tr,
  Td,
  Th,
  TimeLineContainer,
  TimeLineItem,
  Container,
  RoundedDatePicker,
  RoundedInput,
  RoundedSelect,
  FilterContainer,
  FilterHeader,
  SortSwitch,
  DefaultButton,
  FadedText,
  UserEmail,
  MediumFormItem,
  PrimaryButton,
  PrimaryButtonPurple,
  InlineForm,
  BadgeSuccess,
  ActivityNotFound,
  MainMenu
};
