import { Card, InputNumber, Row, Col } from "antd";
import { useFinance } from "../../context/FinanceContext";

const NowSection = () => {
  const { inputs, updateInput } = useFinance();

  return (
    <Card
      title={
        <span className="text-green-700 font-bold">1. HIỆN TẠI (NOW)</span>
      }
      className="h-full shadow-sm border-t-4 border-green-600 hover:shadow-md transition-shadow"
      size="small"
    >
      <div className="space-y-6">
        {/* INPUT: Doanh thu (Quan trọng nhất - Highlight vàng) */}
        <div className="w-full!">
          <label className="block text-xs font-bold text-gray-900 uppercase mb-1">
            Doanh thu / Tháng (100%)
          </label>
          <InputNumber
            className=" bg-yellow-50 border-yellow-400 font-bold text-gray-800! text-sm w-64!"
            size="large"
            value={inputs.revenue !== null ? inputs.revenue : ""}
            placeholder="Nhập doanh thu hiện tại"
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            onChange={(val) => updateInput("revenue", val)}
            min={1}
          />
        </div>

        {/* INPUT: Nhóm Thợ & Ngày làm */}
        <Row gutter={[24, 0]}>
          <Col>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Tổng số thợ
            </label>
            <InputNumber
              className="w-24! front-bold"
              value={inputs.staff}
              onChange={(val) => updateInput("staff", val)}
            />
          </Col>
          <Col>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Tổng số ngày làm/tháng
            </label>
            <InputNumber
              className="w-24! front-bold"
              value={inputs.days}
              onChange={(val) => updateInput("days", val)}
            />
          </Col>
        </Row>

        {/* OUTPUT: Các chỉ số chính */}
        <Row gutter={[24, 0]}>
          <Col>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              AVE Ticket/Tháng
            </label>
            <InputNumber
              className="w-24! front-bold"
              value={inputs.aveTicket}
              onChange={(val) => updateInput("aveTicket", val)}
            />
          </Col>
          <Col>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Tổng giờ làm việc/ngày
            </label>
            <InputNumber
              className="w-24! front-bold"
              value={inputs.totalHoursPerDay}
              onChange={(val) => updateInput("totalHoursPerDay", val)}
            />
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default NowSection;
