import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface BusinessPlan {
  executiveSummary: string;
  companyDescription: any;
  marketAnalysis: any;
  organizationManagement: any;
  productsServices: any;
  marketingSales: any;
  financialProjections: any;
}

export const generatePDF = (plan: BusinessPlan, businessName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
        addHeader();
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 5;
  };

  // Add header to each page
  const addHeader = () => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${businessName} - Business Plan`, margin, 10);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // Cover Page
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('BUSINESS PLAN', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(24);
  doc.text(businessName, pageWidth / 2, 100, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(currentDate, pageWidth / 2, 120, { align: 'center' });

  // Add "CONFIDENTIAL" footer on cover
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('CONFIDENTIAL', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // Table of Contents
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margin, yPosition);
  yPosition += 15;

  const sections = [
    'Executive Summary',
    'Company Description',
    'Market Analysis',
    'Organization & Management',
    'Products & Services',
    'Marketing & Sales Strategy',
    'Financial Projections'
  ];

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  sections.forEach((section, index) => {
    doc.text(`${index + 1}. ${section}`, margin, yPosition);
    yPosition += 8;
  });

  // Executive Summary
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Summary', margin, yPosition);
  yPosition += 10;
  
  addText(plan.executiveSummary);

  // Company Description
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Company Description', margin, yPosition);
  yPosition += 10;

  addText(plan.companyDescription.overview);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Mission Statement', margin, yPosition);
  yPosition += 7;
  addText(plan.companyDescription.missionStatement);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Vision Statement', margin, yPosition);
  yPosition += 7;
  addText(plan.companyDescription.visionStatement);

  // Market Analysis
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Market Analysis', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(14);
  doc.text('Industry Overview', margin, yPosition);
  yPosition += 7;
  addText(plan.marketAnalysis.industryOverview);

  doc.setFontSize(14);
  doc.text('Target Market', margin, yPosition);
  yPosition += 7;
  addText(plan.marketAnalysis.targetMarket);

  doc.setFontSize(14);
  doc.text('Competitive Analysis', margin, yPosition);
  yPosition += 7;
  addText(plan.marketAnalysis.competitiveAnalysis);

  // Organization & Management
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Organization & Management', margin, yPosition);
  yPosition += 10;

  addText(plan.organizationManagement.organizationalStructure);
  addText(plan.organizationManagement.managementTeam);

  // Products & Services
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('5. Products & Services', margin, yPosition);
  yPosition += 10;

  addText(plan.productsServices.overview);
  addText(plan.productsServices.uniqueValueProposition);

  // Marketing & Sales
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('6. Marketing & Sales Strategy', margin, yPosition);
  yPosition += 10;

  addText(plan.marketingSales.marketingStrategy);
  addText(plan.marketingSales.salesStrategy);

  // Financial Projections
  doc.addPage();
  yPosition = margin;
  addHeader();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('7. Financial Projections', margin, yPosition);
  yPosition += 10;

  addText(plan.financialProjections.startupCosts);
  addText(plan.financialProjections.revenueProjections);
  addText(plan.financialProjections.fundingRequirements);

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Page ${i - 1} of ${pageCount - 1}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `${businessName.replace(/[^a-z0-9]/gi, '_')}_Business_Plan.pdf`;
  doc.save(fileName);

  return doc.output('blob');
};
