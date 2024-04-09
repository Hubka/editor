import { Plugin } from '@ckeditor/ckeditor5-core';
import './settings/styles.css';
import FormView from './settings/tag-settings-view';
export default class SimpleBoxUI extends Plugin {
    _balloon: any;
    formView: any;
    init(): void;
    _createFormView(): FormView;
    _getBalloonPositionData(): {
        target: () => Range;
    };
    _showUI(): void;
    _hideUI(): void;
}
