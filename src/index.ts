import { Sheet } from "./spreadsheet/sheet";

const test = async () => {
  const sheet = new Sheet();
  await sheet.init();
  await sheet.setHeader();
  // todo ↓この関数にcsvのデータ入れて書き込んでもらう
  await sheet.addData([]);
  // const rows = await sheet.getRows();
  // console.log(rows);
}

test()