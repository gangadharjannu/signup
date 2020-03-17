import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root .toolbar .title')).getText() as Promise<string>;
  }

  setFormValues(): void {
    const mockSignupFormFields = {
      firstName: 'fn',
      lastName: 'ln',
      email: 'em@i.l',
      password: 'passwordmin8char'
    };
    Object.keys(mockSignupFormFields).forEach(prop => {
      const formElement = element(by.id(prop));
      formElement.sendKeys(mockSignupFormFields[prop]);
    });
    element(by.id('submit')).click();
  }

  getNotificationMessage(): Promise<string> {
    return element(by.css('simple-snack-bar span')).getText() as Promise<string>;
  }
}
