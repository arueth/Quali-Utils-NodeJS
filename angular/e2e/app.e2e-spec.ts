import { QualiUtilsPage } from './app.po';

describe('quali-utils App', () => {
  let page: QualiUtilsPage;

  beforeEach(() => {
    page = new QualiUtilsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
