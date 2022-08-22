require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
import type {
  GoogleSpreadsheetWorksheet as GoogleSpreadsheetWorksheetType,
  GoogleSpreadsheet as GoogleSpreadsheetType,
} from 'google-spreadsheet';
const CREDIT = require('./credentials.json');
const SPREADSHEET_KEY = process.env.SPREADSHEET_KEY;

const header = [
  '約定日',
  '銘柄',
  '銘柄コード',
  '市場',
  '取引',
  '期限',
  '預り',
  '課税',
  '数量',
  '単価',
  '手数料',
  '税額',
  '受渡日',
  '金額/損益',
];

type TradeData = {
  約定日: string;
  銘柄: string;
  銘柄コード: string;
  市場: string;
  取引: string;
  期限: string;
  預り: string;
  課税: string;
  数量: string;
  単価: string;
  手数料: string;
  税額: string;
  受渡日: string;
  '金額/損益': string;
};

export class Sheet {
  doc: GoogleSpreadsheetType;
  sheet: GoogleSpreadsheetWorksheetType;

  constructor() {
    this.doc = new GoogleSpreadsheet(SPREADSHEET_KEY);
  }

  // 非同期処理はconstructorに使えないらしいので分離
  async init() {
    await this.doc.useServiceAccountAuth({
      client_email: CREDIT.client_email,
      private_key: CREDIT.private_key,
    });

    await this.doc.loadInfo();
    this.sheet = this.doc.sheetsByIndex[0];
  }

  async setHeader() {
    await this.sheet.setHeaderRow(header);
  }

  async addData(datas: TradeData[]) {
    await this.sheet.addRows(datas);
  }
}
