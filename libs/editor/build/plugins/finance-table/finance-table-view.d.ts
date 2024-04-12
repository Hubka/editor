import { ButtonView, LabeledFieldView, View } from '@ckeditor/ckeditor5-ui';
export default class FormView extends View {
    focusTracker: any;
    keystrokes: any;
    abbrInputView: any;
    titleInputView: any;
    saveButtonView: any;
    cancelButtonView: any;
    childViews: any;
    _focusCycler: any;
    constructor(locale: any);
    render(): void;
    destroy(): void;
    focus(): void;
    _createInput(label: any): LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView>;
    _createButton(label: any, icon: any, className: any): ButtonView;
}
