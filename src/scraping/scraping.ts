require('dotenv').config();
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');
import type { Browser as BrowserType, Page as PageType } from 'puppeteer';

export class Scraping {
  url: string = process.env.PAGE_URL || 'https://www.google.com';
  id: string  = process.env.ID || 'id';
  password: string = process.env.PASSWORD || 'password';
  time: number = 50;

  // コマンドラインでcsvで受け取りたい期間の始め部分指定. 終わりは実行日
  year: string;
  month: string;
  day: string;

  // @type/puppeteerから持ってきた型
  browser: BrowserType;
  page: PageType;

  static async build(year: string, month: string, day: string): Promise<Scraping> {
    const scraping = new Scraping();
    scraping.year = year;
    scraping.month = month;
    scraping.day = day;
    await this.#setBrowser(scraping);

    return scraping
  }

  static async #setBrowser(scraping: Scraping) {
    scraping.browser = await puppeteer.launch({
      headless: false,
      executablePath: process.env.BROWSER_PATH,
      slowMo: 50,
    });
    scraping.page = await scraping.browser.newPage();
  }

  // 目的のページまで移動
  async #openPage() {
    // マイページログイン
    await this.page.goto(this.url);
    await this.page.type('input[name=use_id]', this.id, { delay: this.time });
    await this.page.type('input[name=user_password]', this.password, {
      delay: this.time,
    });
    await this.page.click('input[name=ACT_login]', { delay: this.time });
    await this.page.waitForSelector('tr.md-addclass');

    // 1つページ移動
    await this.page.click('#link02M > ul > li:nth-child(3) > a', {
      delay: this.time,
    });
    await this.page.waitForSelector('.title-text');

    // さらにページ移動
    await this.page.click('#navi02P > ul > li:nth-child(8) > .navi2M > a', {
      delay: this.time,
    });
    await this.page.waitForSelector('.mtext-db');
  }
}
