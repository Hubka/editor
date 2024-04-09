import { Plugin } from '@ckeditor/ckeditor5-core';
import { FocusTracker } from '@ckeditor/ckeditor5-utils';
import FinanceTableSettingsView from './settings/finance-table-settings-view';
import './settings/styles.css';
export default class FinanceTableUI extends Plugin {
    _balloon: any;
    formView: any;
    focusTracker: FocusTracker;
    init(): void;
    _createFormView(): FinanceTableSettingsView;
    _getBalloonPositionData(): {
        target: () => Range;
    };
    _showUI(): void;
    _hideUI(): void;
}
