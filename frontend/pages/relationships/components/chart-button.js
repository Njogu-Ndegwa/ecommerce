import { Skeleton, Switch, Card, Avatar, Button, Row, Col } from 'antd';
import { PlayCircleOutlined, LineChartOutlined} from '@ant-design/icons';
const { Meta } = Card;

export default function PlotChart() {
    return (
        <Card style={{ width: 200, marginBottom: 16 }}>
                <Row>
      <Col span={6}>
      <Button type="primary" icon={<PlayCircleOutlined />}/>
      </Col>
      <Col span={6} offset={12}>
      <Button type="primary" icon={<LineChartOutlined />}/>
      </Col>
    </Row>
            
        {/* <Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title="Card title"
          description="This is the description"
        /> */}
      </Card>
    )
}