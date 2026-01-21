import { Layout, Button, message, Modal, Drawer } from "antd";
import {
  FilePdfOutlined,
  ShareAltOutlined,
  CopyOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import NowSection from "../sections/NowSection";
import ControlSection from "../sections/ControlSection";
import GoalSection from "../sections/GoalSection";
import OptionsSection from "../sections/OptionsSection";
import StickyFooter from "../StickyFooter";

import { useRef, useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { exportToPDF } from "../../utils/pdfExport";
import { getBestOption } from "../../utils/bestOption";
import { generateShareLink, copyToClipboard } from "../../utils/shareLink";

const { Header, Content } = Layout;

const Dashboard = () => {
  const { inputs, results } = useFinance();
  const nowSectionRef = useRef(null);
  const goalSectionRef = useRef(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareLink, setShareLink] = useState("");

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
      bestOption,
      { inputs, results } 
    );
    setDrawerVisible(false);
  };

  const handleShare = () => {
    const link = generateShareLink(inputs);
    if (link) {
      setShareLink(link);
      setShareModalVisible(true);
    } else {
      message.error("Không thể tạo share link");
    }
    setDrawerVisible(false);
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareLink);
    if (success) {
      message.success("Đã copy link!");
      setShareModalVisible(false);
    } else {
      message.error("Không thể copy link");
    }
  };
  return (
    <Layout className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header className="bg-white! border-b h-14 md:h-16 flex items-center justify-between px-3 md:px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
          <span className="text-xl md:text-2xl">💅</span>
          <h1 className="text-xs md:text-lg font-bold text-gray-800 m-0 tracking-tight truncate">
            NAIL FINANCE <span className="text-pink-600 hidden sm:inline">PLANNER DEMO</span>
          </h1>
        </div>
        
        {/* Desktop buttons */}
        <div className="hidden md:flex gap-2">
          <Button
            type="default"
            icon={<ShareAltOutlined />}
            className="font-bold"
            onClick={handleShare}
          >
            CHIA SẺ
          </Button>
          <Button
            type="primary"
            danger
            icon={<FilePdfOutlined />}
            className="font-bold shadow hover:scale-105 transition-transform"
            onClick={handleExportPDF}
          >
            XUẤT BÁO CÁO
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          type="text"
          icon={<MenuOutlined className="text-lg" />}
          className="md:hidden"
          onClick={() => setDrawerVisible(true)}
        />
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="70%"
      >
        <div className="flex flex-col gap-3">
          <Button
            type="default"
            size="medium"
            icon={<ShareAltOutlined />}
            className="w-full font-bold"
            onClick={handleShare}
            block
          >
            CHIA SẺ
          </Button>
          <Button
            type="primary"
            danger
            size="large"
            icon={<FilePdfOutlined />}
            className="w-full font-bold"
            onClick={handleExportPDF}
            block
          >
            XUẤT BÁO CÁO
          </Button>
        </div>
      </Drawer>

      <Content className="flex-1 p-3 md:p-6 w-full max-w-6xl mx-auto space-y-4 md:space-y-8 pb-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
          <div className="lg:col-span-4" ref={nowSectionRef}>
            <NowSection />
          </div>
          <div className="lg:col-span-8">
            <ControlSection />
          </div>
        </div>

        <div className="rounded-lg md:rounded-xl" ref={goalSectionRef}>
          <GoalSection />
        </div>

        {/* Hàng 3: OPTIONS */}
        <div className=" md:pl-4">
          <OptionsSection
            option1Ref={option1Ref}
            option2Ref={option2Ref}
            option3Ref={option3Ref}
          />
        </div>
      </Content>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 md:border-t-4 border-pink-600 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-2 md:p-4 z-40">
        <div className="max-w-6xl mx-auto">
          <StickyFooter />
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        title="Chia sẻ link"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={[
          <Button
            key="copy"
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>,
          <Button key="close" onClick={() => setShareModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <p className="text-sm md:text-base text-gray-600">
            Copy link này để chia sẻ với người khác. Khi mở link, họ sẽ thấy
            cùng dữ liệu như bạn.
          </p>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs md:text-sm"
            />
            <Button icon={<CopyOutlined />} onClick={handleCopyLink} className="md:w-auto">
              Copy
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
