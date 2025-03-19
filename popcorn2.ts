import { Page, Locator } from '@playwright/test';

export abstract class BasePopup {
    protected page: Page;
    protected popupContainer: Locator;
    protected title: Locator;
    protected message: Locator;
    protected buttons: Locator;
    protected closeButton: Locator;

    constructor(page: Page, popupSelector: string) {
        this.page = page;
        this.popupContainer = page.locator(popupSelector);
        this.title = this.popupContainer.locator('.popup-title'); // Adjust selector
        this.message = this.popupContainer.locator('.popup-message'); // Adjust selector
        this.buttons = this.popupContainer.locator('.popup-button'); // Adjust selector
        this.closeButton = this.popupContainer.locator('.popup-close'); // Adjust selector
    }

    /**
     * Verifies that the popup is visible.
     */
    async isVisible(): Promise<boolean> {
        return await this.popupContainer.isVisible();
    }

    /**
     * Verifies the popup title.
     */
    async verifyTitle(expectedTitle: string): Promise<boolean> {
        const actualTitle = await this.title.textContent();
        return actualTitle?.trim() === expectedTitle;
    }

    /**
     * Verifies the popup message.
     */
    async verifyMessage(expectedMessage: string): Promise<boolean> {
        const actualMessage = await this.message.textContent();
        return actualMessage?.trim() === expectedMessage;
    }

    /**
     * Verifies that expected buttons are present.
     */
    async verifyButtons(expectedButtons: string[]): Promise<boolean> {
        const buttonElements = await this.buttons.all();
        const buttonTexts = await Promise.all(buttonElements.map(btn => btn.textContent()));
        const actualButtons = buttonTexts.map(text => text?.trim()).filter(Boolean);
        return expectedButtons.every(button => actualButtons.includes(button));
    }

    /**
     * Checks if a specific button is enabled.
     */
    async isButtonEnabled(buttonLabel: string): Promise<boolean> {
        const button = this.popupContainer.locator(`.popup-button:text("${buttonLabel}")`);
        return await button.isEnabled();
    }

    /**
     * Clicks a button with the given label if it is enabled.
     */
    async clickButton(buttonLabel: string): Promise<void> {
        const button = this.popupContainer.locator(`.popup-button:text("${buttonLabel}")`);
        if (await button.isEnabled()) {
            await button.click();
        } else {
            throw new Error(`Button '${buttonLabel}' is disabled and cannot be clicked.`);
        }
    }

    /**
     * Verifies if the close button (X) is present.
     */
    async verifyCloseButton(): Promise<boolean> {
        return await this.closeButton.isVisible();
    }

    /**
     * Verifies if the close button (X) is NOT present.
     */
    async verifyNoCloseButton(): Promise<boolean> {
        return await this.closeButton.isHidden();
    }

    /**
     * Clicks the close button (X).
     */
    async closePopup(): Promise<void> {
        await this.closeButton.click();
    }

    /**
     * Business rule function for button enablement logic.
     * This should be overridden in specific modal implementations.
     */
    abstract isEnablementBusinessRules(buttonLabel: string): boolean;
}

// Extended class for modals containing dropdowns
export abstract class DropdownPopup extends BasePopup {
    protected dropdowns: { locator: Locator; expectedCount: number }[];

    constructor(page: Page, popupSelector: string, dropdownConfigs: { selector: string; expectedCount: number }[]) {
        super(page, popupSelector);
        this.dropdowns = dropdownConfigs.map(config => ({
            locator: this.popupContainer.locator(config.selector),
            expectedCount: config.expectedCount,
        }));
    }

    /**
     * Verifies the count of each dropdown present.
     */
    async verifyDropdownCounts(): Promise<boolean> {
        for (const dropdown of this.dropdowns) {
            const actualCount = await dropdown.locator.count();
            if (actualCount !== dropdown.expectedCount) {
                return false;
            }
        }
        return true;
    }
}

// Example implementation of a popup with dropdowns
export class MyDropdownPopup extends DropdownPopup {
    constructor(page: Page) {
        super(page, '#property\\.mypopup', [
            { selector: '.dropdown1', expectedCount: 1 },
            { selector: '.dropdown2', expectedCount: 2 },
            { selector: '.dropdown3', expectedCount: 1 }
        ]);
    }

    /**
     * Custom enablement business rules for MyDropdownPopup.
     */
    isEnablementBusinessRules(buttonLabel: string): boolean {
        return buttonLabel !== 'Done'; // Example: 'Done' button is disabled
    }

    /**
     * Verifies all elements in MyDropdownPopup.
     */
    async verifyAllElements(expectedTitle: string, expectedMessage: string, expectedButtons: string[]): Promise<boolean> {
        const titleValid = await this.verifyTitle(expectedTitle);
        const messageValid = await this.verifyMessage(expectedMessage);
        const buttonsValid = await this.verifyButtons(expectedButtons);
        const dropdownsValid = await this.verifyDropdownCounts();

        return titleValid && messageValid && buttonsValid && dropdownsValid;
    }
}
