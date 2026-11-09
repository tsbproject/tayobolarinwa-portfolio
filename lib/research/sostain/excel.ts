import "server-only";
import ExcelJS from "exceljs";
import { getResearchExportRows } from "./admin-data";

type ExportRow = Awaited<ReturnType<typeof getResearchExportRows>>[number];

const NAVY = "12243A";
const TEAL = "087F8C";
const WHITE = "FFFFFF";
const INK = "263749";
const MUTED = "63748A";
const PALE = "ECF5F7";

function safeText(value: unknown): string {
  const raw = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  // ExcelJS text cells are not formulas, but neutralize dangerous prefixes
  // defensively for future conversions to CSV or other spreadsheet readers.
  return /^[\s\u0000-\u001f]*[=+@-]/u.test(raw) ? "'" + raw : raw;
}

function heading(cell: ExcelJS.Cell, background = NAVY) {
  cell.font = { name: "Aptos", size: 10, color: {argb: WHITE}, bold: true };
  cell.fill = {type:"pattern",pattern:"solid",fgColor:{argb:background}};
  cell.alignment = {vertical:"middle",wrapText:true};
  cell.border = {bottom:{style:"thin",color:{argb:"D3E2E8"}}};
}

function banner(sheet: ExcelJS.Worksheet, title: string, subtitle: string, endColumn: string) {
  sheet.mergeCells(`A1:${endColumn}2`);
  const titleCell = sheet.getCell("A1");
  titleCell.value = title;
  titleCell.font = {name:"Aptos Display",size:19,bold:true,color:{argb:WHITE}};
  titleCell.fill = {type:"pattern",pattern:"solid",fgColor:{argb:NAVY}};
  titleCell.alignment = {vertical:"middle",indent:1};
  sheet.getRow(1).height = 29;
  sheet.getRow(2).height = 21;
  sheet.mergeCells(`A3:${endColumn}3`);
  const subCell = sheet.getCell("A3");
  subCell.value = subtitle;
  subCell.font = {name:"Aptos",size:10,color:{argb:MUTED},italic:true};
  subCell.alignment = {vertical:"middle"};
  sheet.getRow(3).height = 25;
}

export async function buildResearchExcelWorkbook(): Promise<Buffer> {
  const data = await getResearchExportRows();
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sostain Research";
  wb.title = "Sostain Research — De-identified Survey Export";
  wb.subject = "Research survey export without contact details";
  wb.created = new Date();

  const overview = wb.addWorksheet("Overview", {views:[{state:"frozen",ySplit:4}]});
  overview.columns = [
    {width:26},{width:18},{width:4},{width:31},{width:15},
  ];
  banner(overview,"SOSTAIN  /  RESEARCH OVERVIEW","Survey v1.1-short  •  De-identified export  •  Restricted research use","E");

  overview.getCell("A5").value = "TOTAL RESPONSES";
  overview.getCell("A5").font = {bold:true,size:10,color:{argb:MUTED}};
  overview.getCell("A6").value = data.length;
  overview.getCell("A6").font = {bold:true,size:27,color:{argb:TEAL}};
  overview.getCell("D5").value = "EXPORT GENERATED";
  overview.getCell("D5").font = {bold:true,size:10,color:{argb:MUTED}};
  overview.getCell("D6").value = new Date();
  overview.getCell("D6").numFmt = "dd mmm yyyy, hh:mm";
  overview.getCell("D6").font = {bold:true,size:12,color:{argb:INK}};
  overview.getRow(6).height = 39;

  overview.getCell("A9").value = "BUSINESS CATEGORIES";
  overview.getCell("D9").value = "PRICE CONSIDERATION";
  for(const key of ["A9","B9","D9","E9"]) heading(overview.getCell(key),TEAL);
  overview.getCell("A9").value = "Business category";
  overview.getCell("B9").value = "Responses";
  overview.getCell("D9").value = "Monthly price consideration";
  overview.getCell("E9").value = "Responses";
  overview.getRow(9).height = 28;

  const categories = new Map<string,number>();
  const prices = new Map<string,number>();
  for (const row of data) {
    const category = safeText(row.business_category || "Not provided");
    const price = safeText(row.price || "Not provided");
    categories.set(category,(categories.get(category)??0)+1);
    prices.set(price,(prices.get(price)??0)+1);
  }
  const categoryList = [...categories].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
  const priceList = [...prices].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]));
  for(let i=0;i<Math.max(categoryList.length,priceList.length,1);i++){
    const row = 10+i;
    if(categoryList[i]){overview.getCell(`A${row}`).value=categoryList[i][0];overview.getCell(`B${row}`).value=categoryList[i][1];}
    if(priceList[i]){overview.getCell(`D${row}`).value=priceList[i][0];overview.getCell(`E${row}`).value=priceList[i][1];}
    if(i%2===0){
      for(const col of ["A","B","D","E"]){
        overview.getCell(`${col}${row}`).fill={type:"pattern",pattern:"solid",fgColor:{argb:PALE}};
      }
    }
  }
  const noteRow = 12 + Math.max(categoryList.length,priceList.length,1);
  overview.mergeCells(`A${noteRow}:E${noteRow+1}`);
  const note=overview.getCell(`A${noteRow}`);
  note.value="Privacy: Respondent names, contact details, submission IDs, IP addresses and verification tokens are excluded. The Responses sheet contains research answers only. Small category counts may still require careful handling.";
  note.font={name:"Aptos",size:10,color:{argb:MUTED},italic:true};
  note.alignment={wrapText:true,vertical:"middle"};
  overview.getRow(noteRow).height=26;
  overview.getRow(noteRow+1).height=25;

  const sheet = wb.addWorksheet("Responses", {
    views:[{state:"frozen",ySplit:5}],
    properties:{defaultRowHeight:22},
    pageSetup:{orientation:"landscape",fitToPage:true,fitToWidth:1,fitToHeight:0},
  });
  sheet.columns=[
    {key:"submitted_at",width:23},
    {key:"business_category",width:27},
    {key:"team_size",width:17},
    {key:"main_channel",width:22},
    {key:"tracking",width:31},
    {key:"challenges",width:44},
    {key:"challenge_frequency",width:22},
    {key:"price",width:30},
  ];
  banner(sheet,"SOSTAIN  /  SURVEY RESPONSES","Research answers only  •  Filters enabled  •  No interview contacts","H");

  const headers=[
    "Submitted At","Business Category","Team Size","Customer Channel",
    "Sales / Customer Tracking","Biggest Challenges","Problem Frequency","Monthly Price Consideration",
  ];
  headers.forEach((name,index)=>{const cell=sheet.getCell(5,index+1);cell.value=name;heading(cell);});
  sheet.getRow(5).height=40;
  for(let i=0;i<data.length;i++){
    const d: ExportRow=data[i];
    const r=sheet.getRow(i+6);
    const date=new Date(String(d.submitted_at));
    r.values=[
      Number.isNaN(date.getTime()) ? "" : date,
      safeText(d.business_category),safeText(d.team_size),safeText(d.main_channel),
      safeText(d.tracking),
      Array.isArray(d.challenges) ? d.challenges.map(safeText).join(" • ") : safeText(d.challenges),
      safeText(d.challenge_frequency),safeText(d.price),
    ];
    r.getCell(1).numFmt="dd mmm yyyy, hh:mm";
    r.alignment={vertical:"top",wrapText:true};
    r.height=34;
    r.font={name:"Aptos",size:10,color:{argb:INK}};
    if(i%2===1){
      r.eachCell(cell=>{cell.fill={type:"pattern",pattern:"solid",fgColor:{argb:"F2F7FA"}};});
    }
  }
  sheet.autoFilter={from:"A5",to:`H${Math.max(6,data.length+5)}`};
  sheet.getCell("A4").value=`Responses exported: ${data.length}`;
  sheet.getCell("A4").font={name:"Aptos",size:10,bold:true,color:{argb:TEAL}};
  sheet.getRow(4).height=24;

  // For empty surveys, the workbook intentionally contains formatted headings only.
  const arrayBuffer=await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
