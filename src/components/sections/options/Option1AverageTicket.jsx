import { Card, Tag, Progress, Tooltip } from "antd";

import { formatPercent, roundNumber } from "../../../utils/formatters";
import {
  UsergroupAddOutlined,
  InfoCircleOutlined,
  BulbFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useFinance } from "../../../context/FinanceContext";

// Component con hiển thị 1 dòng dữ liệu 3 cột
const MetricRow = ({
  label,
  target,
  current,
  gap,
  isHighlight = false,
  tooltip,
}) => (
  <div
    className={`grid grid-cols-12 gap-2 py-4 border-b border-gray-100 items-center ${
      isHighlight ? "bg-blue-50/50" : ""
    }`}
  >
    {/* Tên chỉ số */}
    <div className="col-span-5 pl-4 font-semibold text-gray-700 text-sm flex items-center gap-1">
      {label}
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoCircleOutlined className="text-gray-300 text-[10px]" />
        </Tooltip>
      )}
    </div>

    {/* Cột 1: Mục tiêu 2026 */}
    <div className="col-span-2 text-center font-bold text-blue-700 text-lg">
      {target === "-" ? "-" : Number(target).toLocaleString()}
    </div>

    {/* Cột 2: Hiện tại 2025 */}
    <div className="col-span-2 text-center text-gray-400 font-medium">
      {current === "-"
        ? "-"
        : typeof current === "number"
        ? `${current.toLocaleString()}`
        : current}
    </div>

    <div className="col-span-3 text-center">
      <Tag
        color="red"
        className="font-bold text-lg! px-3 py-1 border-0 rounded-full min-w-15"
      >
        {" "}
        {gap > 0 ? "+" : gap < 0 ? "-" : ""}
        {typeof gap === "number" ? Math.abs(gap).toLocaleString() : gap}
      </Tag>
    </div>
  </div>
);

const Option1AverageTicket = () => {
  const { inputs, results } = useFinance();
  const { options } = results;
  const option1 = options.option1;

  const {
    targetTickets,
    currentTickets,
    extraTicketsNeeded,
    kpiPerStaff,
    gapDay,
    currentPerStaffDay,
    targetPerStaffDay,
    feasibility,
    insight,
    avtTickekStaffPerMonth,
    currentAvtTickekStaffPerMonth,
    gapAvtTicketStaffPerMonth,
  } = option1;
  // max 45per service
  const serviceTimeMinutes = 45;

  // Icon cho insight dựa trên type
  const insightIcon =
    insight.type === "success" ? (
      <CheckCircleFilled className="text-green-500 text-2xl" />
    ) : (
      <BulbFilled className="text-orange-500 text-2xl" />
    );

  return (
    <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6 h-full">
      <div className=" rounded-xl bg-linear-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <UsergroupAddOutlined className="text-xl" />
          <h3 className="text-white font-bold text-lg m-0 uppercase">
            Option 1: Tăng Average Ticket
          </h3>
        </div>
        <Tag className="font-bold uppercase border-none">
          {feasibility.label}
        </Tag>
      </div>

      <div className="grid grid-cols-12 gap-2 bg-gray-50 py-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
        <div className="col-span-5 pl-4">Chỉ số đo lường</div>
        <div className="col-span-2 text-center text-blue-700">
          Mục tiêu 2026
        </div>
        <div className="col-span-2 text-center">Hiện tại 2025</div>
        <div className="col-span-3 text-center text-red-500">GROWTH</div>
      </div>

      <div className="bg-white">
        {/* 2. Ticket cần thêm / ngày */}
        <MetricRow
          label="Ticket cần thêm / ngày"
          target={Math.round(option1.targetDay)}
          current={Math.round(option1.currentDay)}
          gap={Math.round(gapDay.toFixed(2))}
          tooltip="Số lượng khách cả tiệm cần kiếm thêm mỗi ngày"
        />
        {/* AVT TICKET STAFF PER MONTH */}
        <MetricRow
          label="AVT Ticket / Thợ"
          target={Math.round(avtTickekStaffPerMonth)}
          current={Math.round(currentAvtTickekStaffPerMonth)}
          gap={Math.round(gapAvtTicketStaffPerMonth)}
          tooltip="Số lượng khách cả tiệm cần kiếm thêm mỗi ngày"
        />

        {/* 3. Ticket / ngày / thợ (Quan trọng nhất - Highlight) */}
        <MetricRow
          label="Ticket / ngày / thợ"
          target={roundNumber(targetPerStaffDay)}
          current={roundNumber(currentPerStaffDay)}
          gap={roundNumber(kpiPerStaff)}
          isHighlight={true}
          tooltip="Mỗi thợ phải làm bao nhiêu khách một ngày"
        />
        {/* 4. Tổng ticket cần có / tháng */}
        <MetricRow
          label="Tổng ticket cần có / tháng"
          target={roundNumber(targetTickets)}
          current={roundNumber(currentTickets)}
          gap={roundNumber(extraTicketsNeeded)}
          tooltip="Tổng mục tiêu doanh số ticket cho cả tháng"
        />
      </div>

      <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Thông tin đầu vào */}
          <div className="flex-1 text-xs text-gray-500 space-y-1 w-full border-r border-gray-200 pr-4">
            <p className="font-bold uppercase text-gray-400 mb-2">
              Tham số đánh giá:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <span>
                • Tổng thợ: <b>{inputs.staff}</b>
              </span>
              <span>
                • Số giờ làm: <b>{inputs.totalHoursPerDay}h</b>
              </span>
              <span className="col-span-2">
                • Thời gian làm trung bình:{" "}
                <b>{serviceTimeMinutes} phút/khách</b>
              </span>
            </div>
          </div>

          <div className="flex-2 w-full md:w-1/2 pl-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold uppercase text-gray-500">
                Độ tải (Capacity)
              </span>
              <span
                className={`text-xs font-bold ${
                  formatPercent(feasibility.percent) > 90
                    ? "text-red-600" // Quá tải -> Đỏ
                    : formatPercent(feasibility.percent) > 80
                    ? "text-orange-600" // Căng thẳng -> Cam
                    : formatPercent(feasibility.percent) > 40
                    ? "text-green-600" // Lý tưởng -> Xanh
                    : "text-gray-500" // Vắng khách -> Xám/Vàng
                }`}
              >
                {formatPercent(feasibility.percent)}% -{" "}
                {formatPercent(feasibility.percent) > 90
                  ? "Quá tải" // > 90%: Thở không nổi
                  : formatPercent(feasibility.percent) > 80
                  ? "Căng thẳng" // 80-90%: Rất đông, làm liên tục
                  : formatPercent(feasibility.percent) > 40
                  ? "Lý tưởng" // 40-80%: Vừa làm vừa nghỉ, doanh thu tốt
                  : "Vắng khách"}{" "}
              </span>
            </div>
            <Progress
              percent={formatPercent(feasibility.percent)}
              strokeColor={
                feasibility.color === "green"
                  ? "#52c41a"
                  : feasibility.color === "orange"
                  ? "#fa8c16"
                  : "#ff4d4f"
              }
              showInfo={false}
              strokeLinecap="square"
            />
            <p className="text-[10px] text-gray-400 mt-1 italic text-left">
              *Dưới 30% là còn trống nhiều, hoàn toàn khả thi để tăng khách
            </p>
          </div>
        </div>
      </div>

      {/* INSIGHT ENGINE */}
      <div
        className={`p-4 border-t ${
          insight.type === "success"
            ? "bg-green-50 border-green-100"
            : "bg-orange-50 border-orange-100"
        }`}
      >
        <div className="flex gap-4 items-start">
          <div className="mt-1">{insightIcon}</div>
          <div>
            <h4
              className={`font-bold text-xl m-0 mb-1 ${
                insight.type === "success"
                  ? "text-green-800"
                  : "text-orange-800"
              }`}
            >
              {insight.message}
            </h4>
            <p
              className={`text-xs italic m-0 ${
                insight.type === "success"
                  ? "text-green-700"
                  : "text-orange-700"
              }`}
            >
              "{insight.desc}"
            </p>
          </div>
        </div>

        {/* Thanh Capacity nhỏ gọn bên dưới */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">
            Độ tải thợ:
          </span>
          <Progress
            percent={formatPercent(feasibility.percent)}
            strokeColor={
              feasibility.color === "green"
                ? "#52c41a"
                : feasibility.color === "orange"
                ? "#fa8c16"
                : "#ff4d4f"
            }
            showInfo={false}
            size="small"
            className="w-full"
          />
          <span
            className={`text-xs font-bold ${
              feasibility.color === "green"
                ? "text-green-600"
                : feasibility.color === "orange"
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {formatPercent(feasibility.percent)}%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default Option1AverageTicket;
