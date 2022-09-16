require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
import {
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
  doc: GoogleSpreadsheetType = new GoogleSpreadsheet(SPREADSHEET_KEY);
  worksheet: GoogleSpreadsheetWorksheetType;

  // クラス初期化時に非同期処理をしたいので、constructorの代わり
  static async build(): Promise<Sheet> {
    const sheet = new Sheet();
    await this.#loadSheetInfo(sheet);
    return sheet
  }

  // スプレッドシートの指定したシートを開く
  static async #loadSheetInfo(sheet: Sheet): Promise<void> {
    await sheet.doc.useServiceAccountAuth({
      client_email: CREDIT.client_email,
      private_key: CREDIT.private_key,
    });
    await sheet.doc.loadInfo();
    // 0なら1枚目を開く.2枚目を開きたいときは1を指定,3枚目なら2, ...
    sheet.worksheet = sheet.doc.sheetsByIndex[0];
  }

  async setHeader() {
    await this.worksheet.setHeaderRow(header);
  }

  async addData(datas: TradeData[]) {
    await this.worksheet.addRows(datas);
  }
}
