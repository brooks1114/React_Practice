expectedElementVisibilityRule2(bt: BusinessTransaction): boolean {
    const { currentActivePage, isOmega2, isOmega1, rewriteReason, visitCountQuoteSummary, transactionType } = bt;

    const isQuoteSummaryPage = currentActivePage === QuoteSummaryPageActionsOnload.QUOTE_SUMMARY_PAGENAME;
    const visits = visitCountQuoteSummary <= 1;
    const rewriteReason1 = rewriteReason === RewriteReasonDropDown.DEFAULT_DATA_INPUT_VALUE;
    const rewriteReason2 = rewriteReason === RewriteReasonDropDown.REWRITE_REASON_1ST_NONPAY;
    const isRewrite = transactionType === TransactionTypeDropDown.TRANSACTION_TYPE_REWRITE;
    const Transfer = transactionType === TransactionTypeDropDown.TRANSACTION_TYPE_TRANSFER;

    return isQuoteSummaryPage && visits && (isOmega2 || isOmega1) && (rewriteReason1 || rewriteReason2) || (isRewrite || Transfer);
}