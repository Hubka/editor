import { ButtonView, LabeledFieldView, View } from '@ckeditor/ckeditor5-ui';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
export default class FinanceTableSettingsView extends View {
    abbrInputView: LabeledFieldView;
    titleInputView: LabeledFieldView;
    listInputView: LabeledFieldView;
    saveButtonView: ButtonView;
    cancelButtonView: ButtonView;
    childViews: ViewCollection<LabeledFieldView | ButtonView>;
    borderStyle: any;
    constructor(locale: any);
    render(): void;
    focus(): void;
    _createInput(label: any): LabeledFieldView<import("@ckeditor/ckeditor5-ui").InputTextView>;
    _createButton(label: string, icon: string, className: string): ButtonView;
    _createListInput(label: string, list: any): LabeledFieldView<import("@ckeditor/ckeditor5-ui").DropdownView>;
}
