import React, { useState } from "react";
import { Tabs, Table } from "antd";

const { TabPane } = Tabs;
const initialPane = [
  { title: "Tab 1", content: "Content of Tab 1", key: "1" },
  { title: "Tab 2", content: "Content of Tab 2", key: "2" },
];

export default function TabWithTable() {
  const [panes, setPanes] = useState(initialPane);
  const [activeKey, setActiveKey] = useState(initialPane[0].key);
  const [newTabIndex, setNewTabIndex] = useState(0)

  const onTabChange = (activeKey) => {
    setActiveKey(activeKey);
  };

  const onTabEdit = (targetKey, action) => {
      if(action === 'add'){
        tabAdd(targetKey)
      }else if (action === 'remove') {
        tabRemove(targetKey)
      }
  };

  const tabAdd = () => {
     const activeKey = `newTab${newTabIndex}`;
     console.log(activeKey)
     const newPanes = [...panes];
     newPanes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
     setPanes(newPanes)
     setActiveKey(activeKey)
     setNewTabIndex(prevTabIndex => prevTabIndex + 1)
  }

  const tabRemove = (targetKey) => {
      let newActiveKey = activeKey
      let lastIndex
      panes.forEach((pane, i) => {
          if(pane.key === targetKey) {
              lastIndex = i - 1;
          }
      });
      const newPanes = panes.filter(pane => pane.key !== targetKey);
      if(newPanes.length && newActiveKey === targetKey) {
          if(lastIndex >=0) {
              newActiveKey = newPanes[lastIndex].key;
          } else {
              newActiveKey = newPanes[0].key
          }
      }
      setPanes(newPanes)
      setActiveKey(newActiveKey)

  }
  return (
    <Tabs
      type="editable-card"
      onChange={onTabChange}
      activeKey={activeKey}
      onEdit={onTabEdit}
    >
      {panes.map((pane) => (
        <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
          {pane.content}
        </TabPane>
      ))}
    </Tabs>
  );
}
