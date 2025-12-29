
import React from 'react';
import { pdf } from '@react-pdf/renderer'; // 
import PDFReport from '../components/PDFReport';

/**
 * 
 * @param {Object} sections 
 * @param {Object} bestOption 
 * @param {Object} financeData 
 */
export const exportToPDF = async (sections, bestOption, financeData = null) => {
  try {
    if (!financeData) {
      console.error('Cần truyền financeData vào exportToPDF');
      return;
    }

    const { inputs, results } = financeData;

    // Render PDF component thành blob (dùng pdf() cho browser)
    const blob = await pdf(
      React.createElement(PDFReport, {
        inputs,
        results,
        bestOption,
      })
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `Nail_Finance_Report_${timestamp}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('PDF đã được xuất thành công!');
  } catch (error) {
    console.error('Lỗi khi xuất PDF:', error);
    throw error;
  }
};