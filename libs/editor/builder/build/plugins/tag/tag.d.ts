import { Plugin } from '@ckeditor/ckeditor5-core';
import { ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import { Widget } from '@ckeditor/ckeditor5-widget';
import { ConfigView } from './config-view';
export declare class Tag extends Plugin {
    static get requires(): (typeof TagEditing | typeof TagUI)[];
}
declare class TagUI extends Plugin {
    static get requires(): (typeof ContextualBalloon)[];
    private _balloon;
    private formView;
    init(): void;
    _createFormView(): ConfigView;
    _getBalloonPositionData(): {
        target: () => Range;
    };
    _showUI(): void;
    _hideUI(): void;
}
declare class TagEditing extends Plugin {
    static get requires(): (typeof Widget)[];
    init(): void;
    _defineSchema(): void;
    _defineConverters(): void;
}
export {};
