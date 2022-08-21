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
    this.sheet = this.doc.sheetsByIndex[1];
  }

  async setHeader() {
    await this.sheet.setHeaderRow(header);
  }

  // 本来は引数でデータを受け取る
  async addData(datas) {
    await this.sheet.addRows(datas);
  }
}
