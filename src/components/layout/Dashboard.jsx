// src/components/layout/Dashboard.jsx
import { Layout, Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

// Import các section (chúng ta sẽ code chi tiết ngay sau bước này)
import NowSection from "../sections/NowSection";
import ControlSection from "../sections/ControlSection";
import GoalSection from "../sections/GoalSection";
// import GoalSection from '../sections/GoalSection';
import OptionsSection from "../sections/OptionsSection";
import StickyFooter from "../StickyFooter";

import { useRef } from "react";
import { useFinance } from "../../context/FinanceContext";
import { exportToPDF } from "../../utils/pdfExport";
import { getBestOption } from "../../utils/bestOption";

const { Header, Content } = Layout;

const Dashboard = () => {
  const { results } = useFinance();
  const nowSectionRef = useRef(null);
  const goalSectionRef = useRef(null);
  const option1Ref = useRef(null);
  const option2Ref = useRef(null);
  const option3Ref = useRef(null);

  const handleExportPDF = async () => {
    console.log("Export button clicked");
    console.log("Refs check:", {
      nowSection: nowSectionRef.current,
      goalSection: goalSectionRef.current,
      option1: option1Ref.current,
      option2: option2Ref.current,
      option3: option3Ref.current,
    });

    // Xác định option tốt nhất
    const bestOption = getBestOption(results.options);
    console.log("Best option:", bestOption);

    // Xác định section của option tốt nhất
    let bestOptionRef = null;
    if (bestOption) {
      switch (bestOption.type) {
        case "option1":
          bestOptionRef = option1Ref;
          break;
        case "option2":
          bestOptionRef = option2Ref;
          break;
        case "option3Addon":
        case "option3Discount":
          bestOptionRef = option3Ref;
          break;
      }
    }

    // Export PDF
    await exportToPDF(
      {
        nowSection: nowSectionRef.current,
        goalSection: goalSectionRef.current,
        bestOptionSection: bestOptionRef?.current,
      },
      bestOption
    );
  };
  return (
    <Layout className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header className="bg-white! border-b h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💅</span>
          <h1 className="text-lg font-bold text-gray-800 m-0 tracking-tight">
            NAIL FINANCE <span className="text-pink-600">PLANNER DEMO</span>
          </h1>
        </div>
        <Button
          type="primary"
          danger
          icon={<FilePdfOutlined />}
          className="font-bold shadow hover:scale-105 transition-transform"
          onClick={handleExportPDF}
        >
          XUẤT BÁO CÁO
        </Button>
      </Header>

      <Content className="flex-1 p-6 w-full max-w-6xl mx-auto space-y-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4" ref={nowSectionRef}>
            <NowSection />
          </div>
          <div className="lg:col-span-8">
            <ControlSection />
          </div>
        </div>

        <div className="p-0 rounded-xl" ref={goalSectionRef}>
          <GoalSection />
        </div>

        {/* Hàng 3: OPTIONS */}
        <div className="border-l-4 border-pink-500 pl-4">
          <OptionsSection
            option1Ref={option1Ref}
            option2Ref={option2Ref}
            option3Ref={option3Ref}
          />
        </div>
      </Content>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-pink-600 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-4 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <StickyFooter />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
