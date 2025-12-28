// src/utils/pdfExport.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Export PDF từ các section được chọn
 * Sử dụng html2canvas-pro để hỗ trợ oklch colors
 */
export const exportToPDF = async (sections, bestOption) => {
  console.log('Starting PDF export...');
  
  if (!sections.nowSection && !sections.goalSection && !sections.bestOptionSection) {
    alert('Không có nội dung để xuất PDF.');
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;
  let sectionsAdded = 0;
  const failedSections = [];

  const addSectionToPDF = async (element, title = '') => {
    if (!element) {
      console.warn(`Element is null for: ${title}`);
      return false;
    }

    try {
      console.log(`📸 Capturing: ${title}`);
      console.log(`   Element size: ${element.offsetWidth}x${element.offsetHeight}, scroll: ${element.scrollWidth}x${element.scrollHeight}`);
      
      element.scrollIntoView({ behavior: 'instant', block: 'start' });
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        removeContainer: false,
        height: element.scrollHeight, // Đảm bảo capture đầy đủ chiều cao
        width: element.scrollWidth, // Đảm bảo capture đầy đủ chiều rộng
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        console.warn(`Canvas empty: ${title} - Skipping`);
        failedSections.push(title);
        return false;
      }

      console.log(`   Canvas size: ${canvas.width}x${canvas.height}`);

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (!imgData || imgData === 'data:,') {
        console.warn(`Invalid image: ${title} - Skipping`);
        failedSections.push(title);
        return false;
      }

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yPosition + imgHeight > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 5;
      
      sectionsAdded++;
      return true;
    } catch (error) {
      console.warn(`⚠️ Error capturing ${title}: ${error.message} - Skipping this section`);
      failedSections.push(title);
      return false;
    }
  };

  // Export các sections
  if (sections.nowSection) {
    await addSectionToPDF(sections.nowSection, '1. HIỆN TẠI (NOW)');
  }

  if (sections.goalSection) {
    await addSectionToPDF(sections.goalSection, '2. MỤC TIÊU TĂNG TRƯỞNG 2026');
  }

  if (sections.bestOptionSection) {
    const optionTitle = bestOption 
      ? `3. KỊCH BẢN ĐỀ XUẤT: ${bestOption.name}`
      : '3. KỊCH BẢN ĐỀ XUẤT';
    await addSectionToPDF(sections.bestOptionSection, optionTitle);
  }

  // Lưu PDF
  if (sectionsAdded > 0) {
    const fileName = `Nail_Finance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    console.log(`✅ PDF saved: ${fileName} (${sectionsAdded} sections)`);
    
    if (failedSections.length > 0) {
      console.warn(`⚠️ Skipped ${failedSections.length} sections:`, failedSections);
      alert(`PDF đã được lưu với ${sectionsAdded} section(s).\n\nCó ${failedSections.length} section(s) bị bỏ qua:\n${failedSections.join('\n')}`);
    }
  } else {
    alert('Không thể xuất PDF. Tất cả sections đều gặp lỗi.');
  }
};