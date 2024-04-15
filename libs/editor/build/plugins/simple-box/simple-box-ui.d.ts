import { Plugin } from '@ckeditor/ckeditor5-core';
import { ContextualBalloon } from '@ckeditor/ckeditor5-ui';
export declare class SimpleBoxUI extends Plugin {
    static get requires(): (typeof ContextualBalloon)[];
    _balloon: any;
    formView: any;
    _areActionsVisible: any;
    _isUIInPanel: any;
    _isUIVisible: any;
    init(): void;
    _enableUserBalloonInteractions(): void;
    _getSelectedLinkElement(): any;
    _createFormView(): any;
    _hideUI(): void;
    _showUI(): void;
    _getBalloonPositionData(): {
        target: () => Range;
    };
}
