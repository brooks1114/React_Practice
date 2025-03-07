import { Page } from '@playwright/test';
import BaseActions from '../../../../../src/actions/base-actions/base-actions';
import BusinessRuleTracer from '../../../../logger/logger';
import BusinessTransaction from '../../../../state/business-transaction/new-business/business-transaction';
import { DropDownOptions } from '../../../interfaces/dropdown-options.interface';
import NewBusinessCreditDropDown from './new-business-credit-dropdown';
import QuoteSummaryPageActionsOnload from '../../../../actions/page-actions/cf2/quote-summary-page-actions/onload/quote-summary-page-actions-onload';
import RewriteReasonDropDown from './rewrite-reason-dropdown';

export default class TransactionTypeDropDown extends BaseActions {
    // Define Dropdown values
    public static readonly BLANK: DropDownOptions = { code: ' ', description: '' };
    public static readonly NEW_BUSINESS: DropDownOptions = { code: '01', description: 'New Business' };
    public static readonly REWRITE: DropDownOptions = { code: '03', description: 'Rewrite' };
    public static readonly TRANSFER: DropDownOptions = { code: '02', description: 'Transfer' };

    /**
     * Retrieves the code associated with a given description.
     * @param {string} description - The description of the dropdown option.
     * @returns {string} The code for the corresponding description, or an empty string if not found.
     */
    public static getCodeByDescription(description: string): string {
        const option = [
            this.NEW_BUSINESS, this.TRANSFER, this.REWRITE, this.BLANK
        ].find(option => option.description === description);
        return option ? option.code : '';
    }

    /**
     * Retrieves the description associated with a given code.
     * @param {string} code - The code of the dropdown option.
     * @returns {string} The description for the corresponding code, or an empty string if not found.
     */
    public static getDescriptionByCode(code: string): string {
        const option = [
            this.NEW_BUSINESS, this.TRANSFER, this.REWRITE, this.BLANK
        ].find(option => option.code === code);
        return option ? option.description : '';
    }

    // Properties
    public static readonly CF2_DEFAULTED_VALUE = TransactionTypeDropDown.NEW_BUSINESS.code;
    public static readonly DEFAULT_DATA_INPUT_VALUE = TransactionTypeDropDown.NEW_BUSINESS.description;
    public static readonly FIELD_DESCRIPTION = 'Transaction Type';
    public static readonly UI_LOCATOR = 'select[name="transactionType"]';

    private static instance: TransactionTypeDropDown;

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the TransactionTypeDropDown class.
     * @returns {TransactionTypeDropDown} The singleton instance.
     */
    public static getInstance(): TransactionTypeDropDown {
        if (!TransactionTypeDropDown.instance) {
            TransactionTypeDropDown.instance = new TransactionTypeDropDown();
        }
        return TransactionTypeDropDown.instance;
    }

    /**
     * Handles the change event for the transaction type dropdown.
     * Triggers DOM validation based on the selected transaction type.
     * @param {Page} page - The Playwright page object representing the current page.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant transaction data.
     * @param {string} transactionType - The code representing the selected transaction type.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    async onChange(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer, transactionType: string): Promise<void> {

        const transactionTypePreviousValueIsRewrite = bt.transactionTypePreviousValue == TransactionTypeDropDown.REWRITE.code;

        switch (transactionType) {
            case TransactionTypeDropDown.NEW_BUSINESS.code: {
                super.logOnChangeEvent('TransactionTypeDropDown.NEW_BUSINESS OnChange Triggered', bt.isLoggingOn);
                await this.resetNewBusinessCreditDropDown(page, bt, tracer, NewBusinessCreditDropDown.YES.code, false);
                if (transactionTypePreviousValueIsRewrite) {
                    await this.resetRewriteReasonDropDown(page, bt, tracer, false);
                }
                break;
            }
            case TransactionTypeDropDown.TRANSFER.code: {
                super.logOnChangeEvent('TransactionTypeDropDown.TRANSFER OnChange Triggered', bt.isLoggingOn);
                await this.resetNewBusinessCreditDropDown(page, bt, tracer, NewBusinessCreditDropDown.NO.code, false);
                if (transactionTypePreviousValueIsRewrite) {
                    await this.resetRewriteReasonDropDown(page, bt, tracer, false);
                }
                break;
            }
            case TransactionTypeDropDown.REWRITE.code: {
                super.logOnChangeEvent('TransactionTypeDropDown.REWRITE OnChange Triggered', bt.isLoggingOn);
                await this.resetNewBusinessCreditDropDown(page, bt, tracer, NewBusinessCreditDropDown.NO.code, false);
                break;
            }
            case TransactionTypeDropDown.BLANK.code: {
                super.logOnChangeEvent('TransactionTypeDropDown.BLANK OnChange Triggered', bt.isLoggingOn);
                await this.resetNewBusinessCreditDropDown(page, bt, tracer, NewBusinessCreditDropDown.YES.code, false);
                if (transactionTypePreviousValueIsRewrite) {
                    await this.resetRewriteReasonDropDown(page, bt, tracer, false);
                }
                break;
            }
            default: {
                super.logOnChangeEvent('TransactionTypeDropDown.INVALID_VALUE OnChange Triggered', bt.isLoggingOn);
                break;
            }
        }
        const domValidationEnabled = bt.enableDomValidationQuoteSummaryPage;
        if (domValidationEnabled) {
            await this.validateDomQuoteSummaryPage(page, bt, tracer);
        }
    }

    /**
     * Validates the DOM states of the Quote Summary page.
     * @param {Page} page - The Playwright Page object.
     * @param {BusinessTransaction} bt - The business transaction object.
     * @returns {Promise<void>}
     */
    async validateDomQuoteSummaryPage(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer): Promise<void> {
        const quoteSummaryPageActionsOnload = this.getQuoteSummaryPageActionsOnload();
        await quoteSummaryPageActionsOnload.validateDOMStates(page, bt, tracer);
    }

    /**
     * Resets the rewrite reason dropdown to its default state.
     * @param {Page} page - The Playwright Page object.
     * @param {BusinessTransaction} bt - The business transaction object.
     */
    async resetRewriteReasonDropDown(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer, triggerOnchange: boolean): Promise<void> {
        const rewriteReasonDropDown = RewriteReasonDropDown.getInstance();
        await rewriteReasonDropDown.updateStateAfterSystemAction(page, bt, tracer, RewriteReasonDropDown.BLANK.code, triggerOnchange);
    }

    /**
     * Resets the new business credit dropdown to the expected value.
     * @param {Page} page - The Playwright Page object.
     * @param {BusinessTransaction} bt - The business transaction object.
     * @param {string} expectedDropdownValue - The expected dropdown value to set.
     */
    async resetNewBusinessCreditDropDown(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer, expectedDropdownValue: string, triggerOnchange: boolean) {
        const newBusinessCreditDropDown = NewBusinessCreditDropDown.getInstance();
        await newBusinessCreditDropDown.updateStateAfterSystemAction(page, bt, tracer, expectedDropdownValue, triggerOnchange);
    }

    /**
     * Updates the selected value of the transaction type dropdown.
     * Retrieves the current value, sets the new value, and logs the action.
     * @param {Page} page - The Playwright page object representing the current page.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant transaction data.
     * @param {string} testInput - The new transaction type value to be selected in the dropdown.
     * @returns {Promise<void>} A promise that resolves when the dropdown update is complete.
     */
    // async updateElement(page: Page, bt: BusinessTransaction, testInput: string): Promise<void> {
    //     const description = TransactionTypeDropDown.getDescriptionByCode(testInput);
    //     bt.transactionTypePreviousValue = bt.transactionType;
    //     bt.transactionType = testInput;
    //     await super.selectDropDownOption(page, this.getUILocator(), testInput);
    //     super.logUpdateElementEvent(bt.isLoggingOn, this.constructor.name, this.updateElement.name, description);
    //     bt.transactionTypeUpdateCount++;
    // }

    async updateElement(
        page: Page,
        bt: BusinessTransaction,
        testInput: string
    ): Promise<void> {
        // Call the method to update the dropdown element
        await super.updateDropDownElement(
            page,
            this.getUILocator(),
            this.updateElement.name,
            TransactionTypeDropDown.getDescriptionByCode(testInput),
            testInput,
            bt.isLoggingOn
        );

        // Update bt properties after the dropdown is updated
        bt.transactionTypePreviousValue = bt.transactionType; // Update the previous value to the current
        bt.transactionType = testInput; // Update to the new value
        bt.transactionTypeUpdateCount++; // Increment the update counter
    }


    /**
     * Updates the state of the business transaction after a system action.
     * Sets the previous transaction type to the current one and updates it to the new value.
     * @param {Page} page - The Playwright Page object.
     * @param {BusinessTransaction} bt - The business transaction object.
     * @param {string} newValue - The new transaction type value to be set.
     */
    updateStateAfterSystemAction(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer, newValue: string): void {
        bt.transactionTypePreviousValue = bt.transactionType;
        bt.transactionType = newValue;
        bt.transactionTypeUpdateCount++;
        this.onChange(page, bt, tracer, newValue);
    }

    /**
     * Retrieves the current value of the specified element.
     * Logs the action and returns the value or an empty string if no value is found.
     * @param {Page} page - The Playwright page object representing the current page.
     * @returns {Promise<string>} A promise that resolves to the value of the element, or an empty string if not found.
     */
    async getElementValue(page: Page, isLoggingOn: boolean): Promise<string> {
        const result = await super.getTextFieldByValue(page, this.getUILocator());
        const description = TransactionTypeDropDown.getDescriptionByCode(result);
        const value = result ?? '';
        super.logGetElementEvent(isLoggingOn, this.constructor.name, this.getElementValue.name, description);
        return value;
    }

    /**
     * Retrieves the UI locator for the transaction type dropdown.
     * @returns {string} The string representing the UI locator for the dropdown.
     */
    getUILocator(): string {
        return TransactionTypeDropDown.UI_LOCATOR;
    }

    /**
     * Validates the state of the transaction type element on the page.
     * Checks for element presence, visibility, enablement, value, and dropdown list consistency.
     * @param {Page} page - The Playwright page object representing the current page.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant transaction data.
     * @returns {Promise<void>} A promise that resolves when the validation is complete.
     */
    async validateElementState(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer): Promise<void> {
        const {
            currentActivePage,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            transactionType,
            transactionTypeUpdateCount,
            visitCountQuoteSummary,
            isOmega2,
            isOmega1,
            isLoggingOn,
        } = bt;

        const uiLocator = this.getUILocator();
        const fieldDescription = TransactionTypeDropDown.FIELD_DESCRIPTION;

        const expectedElementCount = this.getExpectedElementCount(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

        await super.assertElementCount(page, isLoggingOn, expectedElementCount, this.getUILocator());
        const isElementPresent = expectedElementCount > 0;

        if (!isElementPresent) {
            bt.transactionTypeIsEnabled = false;
            bt.transactionTypeIsVisible = false;
            bt.transactionTypeIsRequiredInput = false;
            return;
        }

        // Assert visibility
        const isVisibleExpected = this.getExpectedElementVisibility(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

        await super.assertVisibility(page, isLoggingOn, isVisibleExpected, this.getUILocator());
        bt.transactionTypeIsVisible = isVisibleExpected;


        // Assert enablement
        const isEnabledExpected = this.getExpectedElementEnablement(
            currentActivePage,
            visitCountQuoteSummary,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

        await super.assertEnablement(page, isLoggingOn, isEnabledExpected, this.getUILocator());
        bt.transactionTypeIsEnabled = isEnabledExpected;

        // Assert field Value
        const expectedValue = this.getExpectedElementValue(
            currentActivePage,
            transactionTypeUpdateCount,
            isOmega2,
            isOmega1,
            transactionType,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );
        const valueActual = await this.getElementValue(page, isLoggingOn);
        super.assertCurrentElementValue(valueActual, expectedValue, uiLocator);

        if (isVisibleExpected) {
            // Assert Dropdown List
            const currentDropdownListValues = await super.getDropdownOptions(page, this.getUILocator());
            const expectedDropdownListValues = this.getExpectedDropdownListValues(bt, tracer);
            super.assertDropdownList(isVisibleExpected, currentDropdownListValues, expectedDropdownListValues, fieldDescription, currentActivePage);
        }
        // Check if the field is required
        bt.transactionTypeIsRequiredInput = this.getIsRequiredField(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

    }

    /**
     * Determines whether the transaction type element is enabled based on the provided business rules.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {number} visitCountQuoteSummary - The number of times the quote summary page has been visited.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {boolean} True if the element is enabled, false otherwise.
     */
    getExpectedElementEnablement(
        currentActivePage: string,
        visitCountQuoteSummary: number,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): boolean {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;
        const isFirstvisitQuoteSummary = visitCountQuoteSummary === 1;

        const rule1 = isQuoteSummaryPage && isFirstvisitQuoteSummary && validRatingProgram;

        if (rule1) {
            tracer.logRule(5, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }
        return rule1;
    }

    /**
     * Determines whether the transaction type element is visible based on the provided business rules.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {boolean} True if the element is visible, false otherwise.
     */
    getExpectedElementVisibility(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): boolean {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(6, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }
        return rule1;
    }

    /**
     * Determines the expected value of the transaction type element based on business rules.
     * If certain conditions are met, it returns a default value; otherwise, it returns the provided business transaction value.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {number} transactionTypeUpdateCount - The number of times the transaction type has been updated.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} btValue - The value from the business transaction for the transaction type.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {string} The expected value of the transaction type element.
     */
    getExpectedElementValue(
        currentActivePage: string,
        transactionTypeUpdateCount: number,
        isOmega2: boolean,
        isOmega1: boolean,
        transactionType: string,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): string {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const isUpdateCountZero = transactionTypeUpdateCount === 0;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && isUpdateCountZero && validRatingProgram;
        if (rule1) { transactionType = TransactionTypeDropDown.CF2_DEFAULTED_VALUE }
        if (rule1) {
            tracer.logRule(7, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }

        return transactionType;
    }

    /**
     * Determines the expected count of the transaction type element based on business rules.
     * Returns 1 if the current active page is the Quote Summary page and the rating program is valid; otherwise, returns 0.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {number} The expected element count (1 if the element is expected to be present, 0 otherwise).
     */
    getExpectedElementCount(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): number {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(8, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }

        return rule1 ? 1 : 0;
    }

    /**
     * Retrieves the expected dropdown list values for the transaction type.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant data for determining the dropdown values.
     * @returns {string[]} An array of strings representing the expected dropdown values.
     */
    getExpectedDropdownListValues(bt: BusinessTransaction, tracer: BusinessRuleTracer): string[] {
        return this.getExpectedElementDropDownListValues(bt, tracer);
    }

    /**
     * Retrieves the expected dropdown list values based on the current business transaction context.
     * If the current active page is the Quote Summary page and the rating program is valid,
     * it logs relevant transaction details and returns the transaction type descriptions.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant data for determining the dropdown values.
     * @returns {string[]} An array of strings representing the expected dropdown values,
     * or an empty array if the conditions are not met.
     */
    getExpectedElementDropDownListValues(bt: BusinessTransaction, tracer: BusinessRuleTracer): string[] {
        const { currentActivePage, isOmega2, isOmega1 } = bt;
        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(18, [
                { key: 'JURS', value: bt.jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: bt.ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: bt.currentUserDistributionChannel },
                { key: 'DROP_DOWN_VALUES', value: this.elementDropDownListValuesListForRule1().join(', ') }
            ]);
            return this.elementDropDownListValuesListForRule1();
        }
        return [];
    }

    /**
     * Retrieves the dropdown list values for the transaction types.
     * This method returns the descriptions of the transaction types defined in the TransactionTypeDropDown class.
     * @returns {string[]} An array of strings representing the descriptions of the dropdown options.
     */
    elementDropDownListValuesListForRule1(): string[] {
        return [
            TransactionTypeDropDown.NEW_BUSINESS.description,
            TransactionTypeDropDown.TRANSFER.description,
            TransactionTypeDropDown.REWRITE.description,
            TransactionTypeDropDown.BLANK.description,
        ];
    }

    /**
     * Determines whether the transaction type field is required based on the current business context.
     * If the current active page is the Quote Summary page and the rating program is valid,
     * it logs relevant information and returns true; otherwise, it returns false.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {boolean} True if the field is required, false otherwise.
     */
    getIsRequiredField(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): boolean {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(15, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }
        return rule1;
    }

    /**
     * Creates and returns a new instance of the BusinessRuleTracer class.
     * This method is used to create a new tracer instance that can be utilized 
     * for logging business rule evaluations during the application's runtime.
     * @returns {BusinessRuleTracer} A new instance of the BusinessRuleTracer class.
     */
    getBusinessRuleTracer(): BusinessRuleTracer {
        return new BusinessRuleTracer();
    }

    /**
     * Retrieves an instance of the QuoteSummaryPageActionsOnload class.
     * @returns {QuoteSummaryPageActionsOnload} The singleton instance of the QuoteSummaryPageActionsOnload class.
     */
    getQuoteSummaryPageActionsOnload(): QuoteSummaryPageActionsOnload {
        return new QuoteSummaryPageActionsOnload();
    }
}


import { Page } from "@playwright/test";
import BaseActions from "../../../../actions/base-actions/base-actions";
import BusinessTransaction from "../../../../state/business-transaction/new-business/business-transaction";
import { DropDownOptions } from "../../../interfaces/dropdown-options.interface";
import BusinessRuleTracer from "../../../../logger/logger";
import QuoteSummaryPageActionsOnload from "../../../../actions/page-actions/cf2/quote-summary-page-actions/onload/quote-summary-page-actions-onload";

export default class SourceOfBusinessDropDown extends BaseActions {
    // Define Dropdown values
    public static readonly QUICK_QUOTE: DropDownOptions = { code: "54", description: "Quick Quote" };
    public static readonly AFFINITY_ONSITE: DropDownOptions = { code: "37", description: "Affinity Onsite" };
    public static readonly CUNA_ONSITE_VISIT: DropDownOptions = { code: "51", description: "CUNA - Onsite Visit" };
    public static readonly CUNA_LOCAL_MARKETING: DropDownOptions = { code: "52", description: "CUNA - Local Marketing" };
    public static readonly CUNA_REFERRAL: DropDownOptions = { code: "53", description: "CUNA - Referral" };
    public static readonly PRIOR_POLICYHOLDER: DropDownOptions = { code: "09", description: "Prior Policyholder" };
    public static readonly LM_COM: DropDownOptions = { code: "15", description: "LM.com" };
    public static readonly SOCIAL_MEDIA_FACEBOOK: DropDownOptions = { code: "47", description: "Social Media: Facebook" };
    public static readonly SOCIAL_MEDIA_LINKEDIN: DropDownOptions = { code: "48", description: "Social Media: LinkedIn" };
    public static readonly SON_DAUGHTER_REWRITE: DropDownOptions = { code: "11", description: "Son/Daughter Rewrite" };
    public static readonly DIRECT_DEALERSHIP_REFERRAL_PROGRAM: DropDownOptions = { code: "45", description: "Direct Dealership Referral Program" };
    public static readonly AFFINITY_DEALERSHIP_REFERRAL_PROGRAM: DropDownOptions = { code: "38", description: "Affinity Dealership Referral Program" };
    public static readonly SMALL_MORTGAGE_COMPANY_BANK_PARTNERSHIP: DropDownOptions = { code: "46", description: "Small Mortgage Company/Bank Partnerships" };
    public static readonly REFERRAL_AFFINITY_BANK_LENDER: DropDownOptions = { code: "39", description: "Referral - Affinity Bank/Lender" };
    public static readonly REFERRAL: DropDownOptions = { code: "10", description: "Referral" };
    public static readonly PURCHASED_LEAD: DropDownOptions = { code: "41", description: "Purchased Lead" };
    public static readonly NETWORKING_GROUP: DropDownOptions = { code: "42", description: "Networking Group" };
    public static readonly SALES_GENIE: DropDownOptions = { code: "43", description: "SalesGenie" };
    public static readonly COMMUNITY_MARKETING_EVENT: DropDownOptions = { code: "32", description: "Community Marketing Event" };
    public static readonly GIFT_FOR_QUOTE: DropDownOptions = { code: "44", description: "Gift for Quote" };
    public static readonly ADVERTISING: DropDownOptions = { code: "01", description: "Advertising" };
    public static readonly OTHER: DropDownOptions = { code: "54", description: "Other" };
    public static readonly NAR_REFERRAL_PROGRAM: DropDownOptions = { code: "55", description: "NAR Referral Program" };
    public static readonly BLANK: DropDownOptions = { code: " ", description: "" };
    public static readonly PRESENT_POLICYHOLDER: DropDownOptions = { code: "08", description: "Present Policyholder" };

    /**
     * Retrieves the code associated with a given description.
     * @param {string} description - The description of the dropdown option.
     * @returns {string} The code for the corresponding description, or an empty string if not found.
     */
    public static getCodeByDescription(description: string): string {
        const option = [
            this.QUICK_QUOTE,
            this.AFFINITY_ONSITE,
            this.CUNA_ONSITE_VISIT,
            this.CUNA_LOCAL_MARKETING,
            this.CUNA_REFERRAL,
            this.PRIOR_POLICYHOLDER,
            this.LM_COM,
            this.SOCIAL_MEDIA_FACEBOOK,
            this.SOCIAL_MEDIA_LINKEDIN,
            this.SON_DAUGHTER_REWRITE,
            this.DIRECT_DEALERSHIP_REFERRAL_PROGRAM,
            this.AFFINITY_DEALERSHIP_REFERRAL_PROGRAM,
            this.SMALL_MORTGAGE_COMPANY_BANK_PARTNERSHIP,
            this.REFERRAL_AFFINITY_BANK_LENDER,
            this.REFERRAL,
            this.PURCHASED_LEAD,
            this.NETWORKING_GROUP,
            this.SALES_GENIE,
            this.COMMUNITY_MARKETING_EVENT,
            this.GIFT_FOR_QUOTE,
            this.ADVERTISING,
            this.OTHER,
            this.NAR_REFERRAL_PROGRAM,
            this.BLANK,
            this.PRESENT_POLICYHOLDER
        ].find(option => option.description === description);
        return option ? option.code : '';
    }

    /**
     * Retrieves the description associated with a given code.
     * @param {string} code - The code of the dropdown option.
     * @returns {string} The description for the corresponding code, or an empty string if not found.
     */
    public static getDescriptionByCode(code: string): string {
        const option = [
            this.QUICK_QUOTE,
            this.AFFINITY_ONSITE,
            this.CUNA_ONSITE_VISIT,
            this.CUNA_LOCAL_MARKETING,
            this.CUNA_REFERRAL,
            this.PRIOR_POLICYHOLDER,
            this.LM_COM,
            this.SOCIAL_MEDIA_FACEBOOK,
            this.SOCIAL_MEDIA_LINKEDIN,
            this.SON_DAUGHTER_REWRITE,
            this.DIRECT_DEALERSHIP_REFERRAL_PROGRAM,
            this.AFFINITY_DEALERSHIP_REFERRAL_PROGRAM,
            this.SMALL_MORTGAGE_COMPANY_BANK_PARTNERSHIP,
            this.REFERRAL_AFFINITY_BANK_LENDER,
            this.REFERRAL,
            this.PURCHASED_LEAD,
            this.NETWORKING_GROUP,
            this.SALES_GENIE,
            this.COMMUNITY_MARKETING_EVENT,
            this.GIFT_FOR_QUOTE,
            this.ADVERTISING,
            this.OTHER,
            this.NAR_REFERRAL_PROGRAM,
            this.BLANK,
            this.PRESENT_POLICYHOLDER
        ].find(option => option.code === code);
        return option ? option.description : '';
    }

    //Properties
    public static readonly CF2_DEFAULTED_VALUE = SourceOfBusinessDropDown.BLANK.code;
    public static readonly DEFAULT_DATA_INPUT_VALUE = SourceOfBusinessDropDown.QUICK_QUOTE.description;
    public static readonly FIELD_DESCRIPTION = 'Source of Business';
    public static readonly UI_LOCATOR: string = 'select[name="sourceOfBusiness"]';


    private static instance: SourceOfBusinessDropDown;

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the SourceOfBusinessDropDown class.
     *
     * This static method ensures that only one instance of the SourceOfBusinessDropDown class 
     * exists throughout the application, adhering to the Singleton design pattern. If the instance 
     * does not already exist, it creates a new instance and returns it. This is useful for managing 
     * shared state or behavior across the application without creating multiple instances.
     *
     * @returns {SourceOfBusinessDropDown} The singleton instance of the SourceOfBusinessDropDown class.
     * @static
     */
    public static getInstance(): SourceOfBusinessDropDown {
        if (!SourceOfBusinessDropDown.instance) {
            SourceOfBusinessDropDown.instance = new SourceOfBusinessDropDown();
        }
        return SourceOfBusinessDropDown.instance;
    }

    /**
     * Handles the change event for the source of business dropdown.
     *
     */
    async onChange(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer, sourceOfBusiness: string): Promise<void> {
        const description = SourceOfBusinessDropDown.getDescriptionByCode(sourceOfBusiness);
        const upperCaseDescription = description.toUpperCase();
        super.logOnChangeEvent(`SourceOfBusinessDropDown.description OnChange Triggered: ${upperCaseDescription}`, bt.isLoggingOn);

        const domValidationEnabled = bt.enableDomValidationQuoteSummaryPage;
        if (domValidationEnabled) {
            await this.validateDomQuoteSummaryPage(page, bt, tracer);
        }
    }

    /**
     * Validates the DOM states of the Quote Summary page.
     * @param {Page} page - The Playwright Page object.
     * @param {BusinessTransaction} bt - The business transaction object.
     * @returns {Promise<void>}
     */
    async validateDomQuoteSummaryPage(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer): Promise<void> {
        const quoteSummaryPageActionsOnload = this.getQuoteSummaryPageActionsOnload();
        await quoteSummaryPageActionsOnload.validateDOMStates(page, bt, tracer);
    }

    /**
     * Updates the UI element by selecting the specified option from a dropdown
     * and records the previous value and update count of the `BusinessTransaction`.
     *
     * This function calls a method from the superclass to select a dropdown option using 
     * the UI locator associated with the element. It also logs the action performed for 
     * tracking purposes and updates the `BusinessTransaction` object with the previous 
     * source of business value, the new source of business, and increments the update count.
     *
     * Note: `testInput` should be one of the defined dropdown options (e.g., 
     * SourceOfBusinessDropDown.NAR_REFERRAL_PROGRAM, 
     * SourceOfBusinessDropDown.QUICK_QUOTE, etc.).
     *
     * @param {Page} page - The Playwright page object representing the web page containing 
     * the dropdown element.
     * @param {BusinessTransaction} bt - The business transaction object that holds 
     * the previous source of business value and the new source of business to be set.
     * @param {string} testInput - The value of the dropdown option to be selected. 
     * This must match one of the valid options available in the dropdown.
     * @returns {Promise<void>} A promise that resolves when the update and logging actions are complete.
     */

    // async updateElement(page: Page, bt: BusinessTransaction, testInput: string): Promise<void> {
    //     bt.sourceOfBusinessPreviousValue = await this.getElementValue(page);
    //     bt.sourceOfBusiness = testInput;
    //     await super.selectDropDownOption(page, this.getUILocator(), testInput);
    //     await super.logAction(this.constructor.name, this.updateElement.name, testInput);
    //     bt.sourceOfBusinessUpdateCount++;
    // }
    async updateElement(
        page: Page,
        bt: BusinessTransaction,
        testInput: string
    ): Promise<void> {
        // Call the method to update the dropdown element
        await super.updateDropDownElement(
            page,
            this.getUILocator(),
            this.updateElement.name,
            SourceOfBusinessDropDown.getDescriptionByCode(testInput),
            testInput,
            bt.isLoggingOn
        );

        // Update bt properties after the dropdown is updated
        bt.sourceOfBusinessPreviousValue = bt.sourceOfBusiness; // Update the previous value to the current
        bt.sourceOfBusiness = testInput; // Update to the new value
        bt.sourceOfBusinessUpdateCount++; // Increment the update counter
    }

    /**
 * Updates the state of the business transaction after a system action.
 * Sets the previous transaction type to the current one and updates it to the new value.
 * @param {Page} page - The Playwright Page object.
 * @param {BusinessTransaction} bt - The business transaction object.
 * @param {string} newValue - The new transaction type value to be set.
 */
    updateStateAfterSystemAction(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer, newValue: string): void {
        bt.sourceOfBusinessPreviousValue = bt.sourceOfBusiness;
        bt.sourceOfBusiness = newValue;
        bt.sourceOfBusinessUpdateCount++;
        this.onChange(page, bt, tracer, newValue);
    }

    /**
     * Retrieves the current value from the source of business dropdown element on the specified page.
     *
     * This function calls a superclass method to get the dropdown's value using the UI locator
     * associated with the element. If no value is found (i.e., if the result is null or undefined),
     * it defaults to an empty string. The action is logged for tracking purposes.
     *
     * @param {Page} page - The Playwright page object representing the web page containing the dropdown element.
     * @returns {Promise<string>} A promise that resolves to the current value of the dropdown as a string.
     *                            If the dropdown is empty, an empty string is returned.
     */
    async getElementValue(page: Page, isLoggingOn: boolean): Promise<string> {
        const result = await super.getTextFieldByValue(page, this.getUILocator());
        const description = SourceOfBusinessDropDown.getDescriptionByCode(result);
        const value = result ?? '';
        super.logGetElementEvent(isLoggingOn, this.constructor.name, this.getElementValue.name, description);
        return value;
    }

    /**
     * Retrieves the locator string for the UI element associated with the source of business dropdown.
     *
     * This function returns a constant string that represents the locator used to identify the
     * UI element in the DOM. This locator is defined as a class constant and is used in UI automation 
     * tasks to locate the element for interaction.
     *
     * @returns {string} The UI locator for the source of business dropdown element.
     */
    getUILocator(): string {
        return SourceOfBusinessDropDown.UI_LOCATOR;
    }

    async validateElementState(page: Page, bt: BusinessTransaction, tracer: BusinessRuleTracer): Promise<void> {
        const {
            currentActivePage,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            sourceOfBusinessUpdateCount,
            sourceOfBusiness,
            isOmega2,
            isOmega1,
            isLoggingOn,
        } = bt;

        const uiLocator = this.getUILocator();
        const fieldDescription = SourceOfBusinessDropDown.FIELD_DESCRIPTION;

        const expectedElementCount = this.getExpectedElementCount(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

        await super.assertElementCount(page, isLoggingOn, expectedElementCount, this.getUILocator());
        const isElementPresent = expectedElementCount > 0;

        if (!isElementPresent) {
            bt.sourceOfBusinessIsEnabled = false;
            bt.sourceOfBusinessIsVisible = false;
            bt.sourceOfBusinessIsRequiredInput = false;
            return;
        }

        // Assert visibility
        const isVisibleExpected = this.getExpectedElementVisibility(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

        await super.assertVisibility(page, isLoggingOn, isVisibleExpected, this.getUILocator());
        bt.sourceOfBusinessIsVisible = isVisibleExpected;


        // Assert enablement
        const isEnabledExpected = this.getExpectedElementEnablement(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

        await super.assertEnablement(page, isLoggingOn, isEnabledExpected, this.getUILocator());
        bt.sourceOfBusinessIsEnabled = isEnabledExpected;

        // Assert field Value
        const expectedValue = this.getExpectedElementValue(
            currentActivePage,
            sourceOfBusinessUpdateCount,
            isOmega2,
            isOmega1,
            sourceOfBusiness,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );
        const valueActual = await this.getElementValue(page, isLoggingOn);
        super.assertCurrentElementValue(valueActual, expectedValue, uiLocator);

        if (isVisibleExpected) {
            // Assert Dropdown List
            const currentDropdownListValues = await super.getDropdownOptions(page, this.getUILocator());
            const expectedDropdownListValues = this.getExpectedDropdownListValues(bt, tracer);
            super.assertDropdownList(isVisibleExpected, currentDropdownListValues, expectedDropdownListValues, fieldDescription, currentActivePage);
        }
        // Check if the field is required
        bt.sourceOfBusinessIsRequiredInput = this.getIsRequiredField(
            currentActivePage,
            isOmega2,
            isOmega1,
            jurisdiction,
            ratingProgramCode,
            currentUserDistributionChannel,
            tracer
        );

    }



    /**
     * Determines whether the transaction type element is enabled based on the provided business rules.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {number} visitCountQuoteSummary - The number of times the quote summary page has been visited.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {boolean} True if the element is enabled, false otherwise.
     */
    getExpectedElementEnablement(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): boolean {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;


        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(5, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }
        return rule1;
    }

    /**
     * Determines whether the transaction type element is visible based on the provided business rules.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {boolean} True if the element is visible, false otherwise.
     */
    getExpectedElementVisibility(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): boolean {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(6, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }
        return rule1;
    }

    /**
     * Determines the expected value of the transaction type element based on business rules.
     * If certain conditions are met, it returns a default value; otherwise, it returns the provided business transaction value.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {number} sourceOfBusinessUpdateCount - The number of times the transaction type has been updated.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} btValue - The value from the business transaction for the transaction type.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {string} The expected value of the transaction type element.
     */
    getExpectedElementValue(
        currentActivePage: string,
        sourceOfBusinessUpdateCount: number,
        isOmega2: boolean,
        isOmega1: boolean,
        sourceOfBusiness: string,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): string {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const isUpdateCountZero = sourceOfBusinessUpdateCount === 0;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && isUpdateCountZero && validRatingProgram;
        if (rule1) { sourceOfBusiness = SourceOfBusinessDropDown.CF2_DEFAULTED_VALUE }
        if (rule1) {
            tracer.logRule(7, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }

        return sourceOfBusiness;
    }

    /**
     * Determines the expected count of the transaction type element based on business rules.
     * Returns 1 if the current active page is the Quote Summary page and the rating program is valid; otherwise, returns 0.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {number} The expected element count (1 if the element is expected to be present, 0 otherwise).
     */
    getExpectedElementCount(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): number {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(8, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }

        return rule1 ? 1 : 0;
    }

    /**
     * Retrieves the expected dropdown list values for the transaction type.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant data for determining the dropdown values.
     * @returns {string[]} An array of strings representing the expected dropdown values.
     */
    getExpectedDropdownListValues(bt: BusinessTransaction, tracer: BusinessRuleTracer): string[] {
        return this.getExpectedElementDropDownListValues(bt, tracer);
    }

    /**
     * Retrieves the expected dropdown list values based on the current business transaction context.
     * If the current active page is the Quote Summary page and the rating program is valid,
     * it logs relevant transaction details and returns the transaction type descriptions.
     * @param {BusinessTransaction} bt - The business transaction object containing relevant data for determining the dropdown values.
     * @returns {string[]} An array of strings representing the expected dropdown values,
     * or an empty array if the conditions are not met.
     */
    getExpectedElementDropDownListValues(bt: BusinessTransaction, tracer: BusinessRuleTracer): string[] {
        const { currentActivePage, isOmega2, isOmega1 } = bt;
        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(18, [
                { key: 'JURS', value: bt.jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: bt.ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: bt.currentUserDistributionChannel },
                { key: 'DROP_DOWN_VALUES', value: this.elementDropDownListValuesListForRule1().join(', ') }
            ]);
            return this.elementDropDownListValuesListForRule1();
        }
        return [];
    }

    /**
     * Retrieves the dropdown list values for the transaction types.
     * This method returns the descriptions of the transaction types defined in the SourceOfBusinessDropDown class.
     * @returns {string[]} An array of strings representing the descriptions of the dropdown options.
     */
    elementDropDownListValuesListForRule1(): string[] {
        return [
            SourceOfBusinessDropDown.QUICK_QUOTE.description,
            SourceOfBusinessDropDown.AFFINITY_ONSITE.description,
            SourceOfBusinessDropDown.CUNA_ONSITE_VISIT.description,
            SourceOfBusinessDropDown.CUNA_LOCAL_MARKETING.description,
            SourceOfBusinessDropDown.CUNA_REFERRAL.description,
            SourceOfBusinessDropDown.PRIOR_POLICYHOLDER.description,
            SourceOfBusinessDropDown.LM_COM.description,
            SourceOfBusinessDropDown.SOCIAL_MEDIA_FACEBOOK.description,
            SourceOfBusinessDropDown.SOCIAL_MEDIA_LINKEDIN.description,
            SourceOfBusinessDropDown.SON_DAUGHTER_REWRITE.description,
            SourceOfBusinessDropDown.DIRECT_DEALERSHIP_REFERRAL_PROGRAM.description,
            SourceOfBusinessDropDown.AFFINITY_DEALERSHIP_REFERRAL_PROGRAM.description,
            SourceOfBusinessDropDown.SMALL_MORTGAGE_COMPANY_BANK_PARTNERSHIP.description,
            SourceOfBusinessDropDown.REFERRAL_AFFINITY_BANK_LENDER.description,
            SourceOfBusinessDropDown.REFERRAL.description,
            SourceOfBusinessDropDown.PURCHASED_LEAD.description,
            SourceOfBusinessDropDown.NETWORKING_GROUP.description,
            SourceOfBusinessDropDown.SALES_GENIE.description,
            SourceOfBusinessDropDown.COMMUNITY_MARKETING_EVENT.description,
            SourceOfBusinessDropDown.GIFT_FOR_QUOTE.description,
            SourceOfBusinessDropDown.ADVERTISING.description,
            SourceOfBusinessDropDown.OTHER.description,
            SourceOfBusinessDropDown.NAR_REFERRAL_PROGRAM.description,
            SourceOfBusinessDropDown.BLANK.description,
            SourceOfBusinessDropDown.PRESENT_POLICYHOLDER.description

        ];
    }

    /**
     * Determines whether the transaction type field is required based on the current business context.
     * If the current active page is the Quote Summary page and the rating program is valid,
     * it logs relevant information and returns true; otherwise, it returns false.
     * @param {string} currentActivePage - The name of the current active page.
     * @param {boolean} isOmega2 - Indicates if the current context is Omega2.
     * @param {boolean} isOmega1 - Indicates if the current context is Omega1.
     * @param {string} jurisdiction - The jurisdiction code relevant to the transaction.
     * @param {string} ratingProgramCode - The code for the rating program.
     * @param {string} currentUserDistributionChannel - The distribution channel of the current user.
     * @returns {boolean} True if the field is required, false otherwise.
     */
    getIsRequiredField(
        currentActivePage: string,
        isOmega2: boolean,
        isOmega1: boolean,
        jurisdiction: string,
        ratingProgramCode: string,
        currentUserDistributionChannel: string,
        tracer: BusinessRuleTracer
    ): boolean {

        const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
        const validRatingProgram = isOmega2 || isOmega1;

        const rule1 = isQuoteSummaryPage && validRatingProgram;

        if (rule1) {
            tracer.logRule(15, [
                { key: 'JURS', value: jurisdiction },
                { key: 'RATING_PROGRAM_CODE', value: ratingProgramCode },
                { key: 'USER_DISTRIBUTION_CHANNEL', value: currentUserDistributionChannel },
            ]);
        }
        return rule1;
    }

    /**
     * Creates and returns a new instance of the BusinessRuleTracer class.
     * This method is used to create a new tracer instance that can be utilized 
     * for logging business rule evaluations during the application's runtime.
     * @returns {BusinessRuleTracer} A new instance of the BusinessRuleTracer class.
     */
    getBusinessRuleTracer(): BusinessRuleTracer {
        return new BusinessRuleTracer();
    }

    /**
     * Retrieves an instance of the QuoteSummaryPageActionsOnload class.
     * @returns {QuoteSummaryPageActionsOnload} The singleton instance of the QuoteSummaryPageActionsOnload class.
     */
    getQuoteSummaryPageActionsOnload(): QuoteSummaryPageActionsOnload {
        return new QuoteSummaryPageActionsOnload();
    }
}
