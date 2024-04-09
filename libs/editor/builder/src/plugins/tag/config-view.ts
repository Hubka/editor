import { icons } from '@ckeditor/ckeditor5-core';
import { ButtonView, createLabeledInputText, LabeledFieldView, submitHandler, View } from '@ckeditor/ckeditor5-ui';
import { Collection, Locale } from '@ckeditor/ckeditor5-utils';
import './config-view.css';

export class ConfigView extends View {
   public abbrInputView: LabeledFieldView;
   public titleInputView: LabeledFieldView;
   public saveButtonView: ButtonView;
   public cancelButtonView: ButtonView;
   public childViews: Collection<View>;

   constructor(locale: Locale) {
      super(locale);

      this.abbrInputView = this._createInput('Add abbreviation');
      this.titleInputView = this._createInput('Add title');

      // Create the save and cancel buttons.
      this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
      // Set the type to 'submit', which will trigger
      // the submit event on entire form when clicked.
      this.saveButtonView.type = 'submit';

      this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');
      // Delegate ButtonView#execute to FormView#cancel.
      this.cancelButtonView.delegate('execute').to(this, 'cancel');

      //
      this.childViews = this.createCollection([this.abbrInputView, this.titleInputView, this.saveButtonView, this.cancelButtonView]);

      this.setTemplate({
         tag: 'form',
         attributes: {
            class: ['ck', 'ck-tag-form'],
            tabindex: '-1'
         },
         children: this.childViews
      });
   }

   public override render(): void {
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

   private _createInput(label: string): LabeledFieldView {
      const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

      labeledInput.label = label;

      return labeledInput;
   }

   private _createButton(label: string, icon: string, className: string): ButtonView {
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
