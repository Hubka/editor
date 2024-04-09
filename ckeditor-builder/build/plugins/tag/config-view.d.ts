import { ButtonView, LabeledFieldView, View } from '@ckeditor/ckeditor5-ui';
import { Collection, Locale } from '@ckeditor/ckeditor5-utils';
import './config-view.css';
export declare class ConfigView extends View {
    abbrInputView: LabeledFieldView;
    titleInputView: LabeledFieldView;
    saveButtonView: ButtonView;
    cancelButtonView: ButtonView;
    childViews: Collection<View>;
    constructor(locale: Locale);
    render(): void;
    focus(): void;
    private _createInput;
    private _createButton;
}
