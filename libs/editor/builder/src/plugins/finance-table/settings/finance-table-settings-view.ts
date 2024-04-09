import { icons } from '@ckeditor/ckeditor5-core';
import { getBorderStyleDefinitions, getBorderStyleLabels } from '@ckeditor/ckeditor5-table/src/utils/ui/table-properties';
import {
   addListToDropdown,
   ButtonView,
   createLabeledDropdown,
   createLabeledInputText,
   LabeledFieldView,
   submitHandler,
   View
} from '@ckeditor/ckeditor5-ui';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

export default class FinanceTableSettingsView extends View {
   abbrInputView: LabeledFieldView;
   titleInputView: LabeledFieldView;
   listInputView: LabeledFieldView;
   saveButtonView: ButtonView;
   cancelButtonView: ButtonView;
   childViews: ViewCollection<LabeledFieldView | ButtonView>;

   borderStyle: any;

   constructor(locale: any) {
      super(locale);

      this.set({
         borderStyle: ''
      });

      this.abbrInputView = this._createInput('Add abbreviation');
      this.titleInputView = this._createInput('Add title');
      this.listInputView = this._createListInput('Add title', []);

      // Create the save and cancel buttons.
      this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
      // Set the type to 'submit', which will trigger
      // the submit event on entire form when clicked.
      this.saveButtonView.type = 'submit';

      this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');

      this.cancelButtonView.delegate('execute').to(this, 'cancel');

      this.childViews = this.createCollection([
         this.listInputView,
         this.abbrInputView,
         this.titleInputView,
         this.saveButtonView,
         this.cancelButtonView
      ]);

      this.setTemplate({
         tag: 'form',
         attributes: {
            class: ['ck', 'ck-abbr-form'],
            tabindex: '-1'
         },
         children: this.childViews
      });
   }

   override render() {
      super.render();

      // Submit the form when the user clicked the save button
      // or pressed enter in the input.
      submitHandler({
         view: this
      });
   }

   focus() {
      if (this.childViews.first instanceof HTMLElement) {
         this.childViews.first.focus();
      }
   }

   _createInput(label: any) {
      const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

      labeledInput.label = label;

      return labeledInput;
   }

   _createButton(label: string, icon: string, className: string): ButtonView {
      const button = new ButtonView();

      button.set({
         label,
         icon,
         tooltip: true,
         class: className
      });

      return button;
   }

   _createListInput(label: string, list: any) {
      if (!this.t) {
         return new LabeledFieldView(this.locale, createLabeledDropdown);
      }

      const styleLabels = getBorderStyleLabels(this.t);
      const borderStyleDropdown = new LabeledFieldView(this.locale, createLabeledDropdown);
      borderStyleDropdown.set({
         label: this.t('Style'),
         class: 'ck-table-form__border-style'
      });

      borderStyleDropdown.fieldView.buttonView.set({
         isOn: false,
         withText: true,
         tooltip: this.t('Style')
      });

      borderStyleDropdown.fieldView.buttonView.bind('label').to(this, 'borderStyle', (value) => {
         return styleLabels[value ? value : 'none'];
      });

      borderStyleDropdown.fieldView.on('execute', (evt: any) => {
         this.borderStyle = evt.source._borderStyleValue;
      });

      addListToDropdown(borderStyleDropdown.fieldView, getBorderStyleDefinitions(this as any, 'dotted'));

      return borderStyleDropdown;
   }
}
