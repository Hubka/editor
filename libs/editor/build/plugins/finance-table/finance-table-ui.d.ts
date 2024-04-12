import { Plugin } from '@ckeditor/ckeditor5-core';
import { ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import './finance-table.css';
export default class FinanceTableUI extends Plugin {
    static get requires(): (typeof ContextualBalloon)[];
    _balloon: any;
    formView: any;
    _areActionsVisible: any;
    _isUIInPanel: any;
    _isUIVisible: any;
    init(): void;
    _createFormView(): any;
    _showUI(): void;
    _hideUI(): void;
    _getBalloonPositionData(): {
        target: () => Range;
    };
    _enableUserBalloonInteractions(): void;
    _getSelectedLinkElement(): any;
}
