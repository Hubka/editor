import { Plugin } from '@ckeditor/ckeditor5-core';
import { ClickObserver } from '@ckeditor/ckeditor5-engine';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
import FormView from './finance-table-view';
import './finance-table.css';

export default class FinanceTableUI extends Plugin {
   static get requires() {
      return [ContextualBalloon];
   }

   _balloon: any;
   formView: any;
   _areActionsVisible: any;
   _isUIInPanel: any;
   _isUIVisible: any;

   init() {
      const editor = this.editor;

      // Create the balloon and the form view.
      this._balloon = this.editor.plugins.get(ContextualBalloon);
      this.formView = this._createFormView();

      editor.ui.componentFactory.add('finance-table', () => {
         const button = new ButtonView();

         button.label = 'FinanceTable';
         button.tooltip = true;
         button.withText = true;

         // Show the UI on button click.
         this.listenTo(button, 'execute', () => {
            this._showUI();
         });

         return button;
      });

      this._enableUserBalloonInteractions();
   }

   _createFormView() {
      const editor = this.editor;
      const formView = new FormView(editor.locale) as any;

      // Execute the command after clicking the "Save" button.
      this.listenTo(formView, 'submit', () => {
         // Grab values from the finance-table and title input fields.
         const value = {
            abbr: formView.abbrInputView.fieldView.element.value,
            title: formView.titleInputView.fieldView.element.value
         };
         editor.execute('addFinanceTable', value);

         // Hide the form view after submit.
         this._hideUI();
      });

      // Hide the form view after clicking the "Cancel" button.
      this.listenTo(formView, 'cancel', () => {
         this._hideUI();
      });

      // Hide the form view when clicking outside the balloon.
      clickOutsideHandler({
         emitter: formView,
         activator: () => this._balloon.visibleView === formView,
         contextElements: [this._balloon.view.element],
         callback: () => this._hideUI()
      });

      return formView;
   }

   _showUI() {
      const selection = this.editor.model.document.selection as any;

      // Check the value of the command.
      const commandValue = this.editor.commands.get('addFinanceTable')!.value as any;

      this._balloon.add({
         view: this.formView,
         position: this._getBalloonPositionData()
      });

      // Disable the input when the selection is not collapsed.
      this.formView.abbrInputView.isEnabled = selection.getFirstRange().isCollapsed;

      // Fill the form using the state (value) of the command.
      if (commandValue) {
         this.formView.abbrInputView.fieldView.value = commandValue.abbr;
         this.formView.titleInputView.fieldView.value = commandValue.title;
      }
      // If the command has no value, put the currently selected text (not collapsed)
      // in the first field and empty the second in that case.
      else {
         const selectedText = getRangeText(selection.getFirstRange());

         this.formView.abbrInputView.fieldView.value = selectedText;
         this.formView.titleInputView.fieldView.value = '';
      }

      this.formView.focus();
   }

   _hideUI() {
      // Clear the input field values and reset the form.
      this.formView.abbrInputView.fieldView.value = '';
      this.formView.titleInputView.fieldView.value = '';
      this.formView.element.reset();

      this._balloon.remove(this.formView);

      // Focus the editing view after inserting the finance-table so the user can start typing the content
      // right away and keep the editor focused.
      this.editor.editing.view.focus();
   }

   _getBalloonPositionData() {
      const view = this.editor.editing.view;
      const viewDocument = view.document as any;
      let target = null;

      // Set a target position by converting view selection range to DOM
      target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

      return {
         target
      };
   }

   _enableUserBalloonInteractions() {
      const view = this.editor.editing.view;
      const viewDocument = view.document;

      view.addObserver(ClickObserver);

      this.listenTo(viewDocument, 'click', () => {
         const parentLink = this._getSelectedLinkElement();

         if (parentLink) {
            // Then show panel but keep focus inside editor editable.
            this._showUI();
         }
      });

      // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
      this.editor.keystrokes.set('Esc', (data, cancel) => {
         if (this._isUIVisible) {
            this._hideUI();
            cancel();
         }
      });

      // Close on click outside of balloon panel element.
      clickOutsideHandler({
         emitter: this.formView,
         activator: () => this._isUIInPanel,
         contextElements: [this._balloon.view.element],
         callback: () => this._hideUI()
      });
   }

   _getSelectedLinkElement() {
      const view = this.editor.editing.view;
      const selection = view.document.selection as any;

      console.log(selection.getFirstRange().getTrimmed());

      if (selection.isCollapsed) {
         return findLinkElementAncestor(selection.getFirstPosition());
      } else {
         // The range for fully selected link is usually anchored in adjacent text nodes.
         // Trim it to get closer to the actual link element.
         const range = selection.getFirstRange().getTrimmed();
         const startLink = findLinkElementAncestor(range.start);
         const endLink = findLinkElementAncestor(range.end);

         if (!startLink || startLink != endLink) {
            return null;
         }

         // Check if the link element is fully selected.
         if (view.createRangeIn(startLink).getTrimmed().isEqual(range)) {
            return startLink;
         } else {
            return null;
         }
      }
   }
}

function getRangeText(range: any) {
   return Array.from(range.getItems()).reduce((rangeText, node: any) => {
      if (!(node.is('text') || node.is('textProxy'))) {
         return rangeText;
      }

      return rangeText + node.data;
   }, '');
}

function findLinkElementAncestor(position: any) {
   return position.getAncestors().find((ancestor: any) => isLinkElement(ancestor));
}
function isLinkElement(node: any) {
   return node.name === 'abbr';
}
