import { icons } from '@ckeditor/ckeditor5-core';
import { ButtonView, createLabeledInputText, LabeledFieldView, submitHandler, View } from '@ckeditor/ckeditor5-ui';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

export default class FormView extends View {
   abbrInputView: LabeledFieldView;
   titleInputView: LabeledFieldView;
   saveButtonView: ButtonView;
   cancelButtonView: ButtonView;
   childViews: ViewCollection<LabeledFieldView | ButtonView>;

   constructor(locale: any) {
      super(locale);

      this.abbrInputView = this._createInput('Add abbreviation');
      this.titleInputView = this._createInput('Add title');

      // Create the save and cancel buttons.
      this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
      // Set the type to 'submit', which will trigger
      // the submit event on entire form when clicked.
      this.saveButtonView.type = 'submit';

      this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');

      this.cancelButtonView.delegate('execute').to(this, 'cancel');

      this.childViews = this.createCollection([this.abbrInputView, this.titleInputView, this.saveButtonView, this.cancelButtonView]);

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
}
