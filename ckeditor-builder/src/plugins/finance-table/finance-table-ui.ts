import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView, clickOutsideHandler, ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import { FocusTracker } from '@ckeditor/ckeditor5-utils';
import { insertCommandName, parentElName } from './constants/names';
import FinanceTableSettingsView from './settings/finance-table-settings-view';
import './settings/styles.css';

export default class FinanceTableUI extends Plugin {
   _balloon: any;
   formView: any;

   focusTracker = new FocusTracker();

   init() {
      console.log('SimpleBoxUI#init() got called');

      const editor = this.editor;
      const t = editor.t;

      editor.model.schema.extend('paragraph', { allowAttributes: ['class'] });
      editor.conversion.attributeToAttribute({ model: 'class', view: 'class' });

      // Create the balloon and the form view.
      this._balloon = this.editor.plugins.get(ContextualBalloon);
      this.formView = this._createFormView();

      editor.editing.view.document.on('change:isFocused', (evt, data, isFocused) => {

      });

      const viewDocument = this.editor.editing.view.document;

      editor.editing.view.document.on('click', (evt, data) => {
         const view = this.editor.editing.view;
         const selection = view.document.selection;

         console.log('click selection', selection)
      })

      // Handle click on view document and show panel when selection is placed inside the link element.
      // Keep panel open until selection will be inside the same link element.
      this.listenTo( viewDocument, 'click', () => {
         const view = this.editor.editing.view;
         const selection = view.document.selection;

         console.log('selection', selection)
      } );

      // editor.editing.view.document.on('click', (evt, data) => {
      //    console.log('evt', evt);
      //    console.log('getFirstRange', editor.editing.view.document.selection.getFirstRange());
      //    console.log('----------------');
      //    console.log('----------------');
      //    // evt.stop();
      //    // if ( data.keyCode === keyCodes.enter ) {
      //    //    let current = editor.editing.view.document.selection.getFirstRange();
      //    //    let position = new ViewPosition(current.start.parent);
      //    //    let walker = new ViewTreeWalker({startPosition: position});
      //    //    for (let element of walker) {
      //    //       if ( element.type === 'elementStart' && element.item._attrs.get('editableElement') === 'true') {
      //    //          editor.editing.view.change(writer => {
      //    //             writer.setSelection(element.item, 'in');
      //    //          });
      //    //          return;
      //    //       }
      //    //    }
      //    // }
      // });

      // editor.ui.on('ready', () => {
      //    const domRoot = this.editor.editing.view.getDomRoot();
      //
      //    console.log('domRoot', domRoot);
      //    // Do something with the DOM root...
      // });

      // let tracking = false;
      // this.editor.model.change((writer) => {
      //    if (tracking) {
      //       return;
      //    }
      //
      //    tracking = true;
      //    const el = this.editor.editing.view.getDomRoot();
      //    if (el) {
      //       this.focusTracker.add(el);
      //
      //       this.focusTracker.on('change:isFocused', (evt, name, value) => {
      //          console.log('evt', evt);
      //          console.log('name', evt);
      //          console.log('evt', evt);
      //          console.log('----------------');
      //          console.log('----------------');
      //       });
      //    }
      // });

      // The "simpleBox" button must be registered among the UI components of the editor
      // to be displayed in the toolbar.
      editor.ui.componentFactory.add(parentElName, (locale) => {
         // The state of the button will be bound to the widget command.
         const command: any = editor.commands.get(insertCommandName);

         // The button will be an instance of ButtonView.
         const buttonView = new ButtonView(locale);

         buttonView.set({
            // The t() function helps localize the editor. All strings enclosed in t() can be
            // translated and change when the language of the editor changes.
            label: t('Finance table'),
            withText: true,
            tooltip: true
         });

         // Bind the state of the button to the command.
         buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

         // Execute the command when the button is clicked (executed).
         this.listenTo(buttonView, 'execute', () => {
            editor.execute(insertCommandName);
            this._showUI();
         });

         // this.listenTo(buttonView, 'execute', () => {
         //    const title = 'What You See Is What You Get';
         //    const abbr = 'WYSIWYG';
         //
         //    editor.model.change((writer) => {
         //       editor.model.insertContent(writer.createText(abbr));
         //    });
         //
         //    // Show the UI on button click.
         //    this.listenTo(buttonView, 'execute', () => {
         //       this._showUI();
         //    });
         // });

         return buttonView;
      });
   }

   _createFormView() {
      const editor = this.editor;
      const formView = new FinanceTableSettingsView(editor.locale);

      this.listenTo(formView, 'submit', () => {
         const title = (formView.titleInputView as any).fieldView.element.value;
         const abbr = (formView.abbrInputView as any).fieldView.element.value;
         const listInputView = formView.borderStyle;

         console.log('listInputView', listInputView);

         editor.model.change((writer) => {
            // editor.model.schema.getDefinitions()
            // editor.model.insertContent(writer.createText(abbr));

            const editor = this.editor;
            const selection = editor.model.document.selection;
            const selectedElement = selection.getSelectedElement();

            Array.from(selectedElement?.getChildren() || []).forEach((child: any) => {
               if (child.name === 'simpleBoxTitle') {
                  writer.insertText('some title', child);
               }
            });

            if (selectedElement) {
               writer.insertElement('paragraph', selectedElement);
               writer.setAttribute('class', listInputView, selectedElement);
            }
         });

         this._hideUI();
      });

      this.listenTo(formView, 'cancel', () => {
         this._hideUI();
      });

      clickOutsideHandler({
         emitter: formView,
         activator: () => this._balloon.visibleView === formView,
         contextElements: [this._balloon.view.element],
         callback: () => this._hideUI()
      });

      return formView;
   }

   _getBalloonPositionData() {
      const view = this.editor.editing.view;
      const viewDocument = view.document;
      let target = null;

      // Set a target position by converting view selection range to DOM.
      target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange() as any);

      return {
         target
      };
   }

   _showUI() {
      this._balloon.add({
         view: this.formView,
         position: this._getBalloonPositionData()
      });

      this.formView.focus();
   }

   _hideUI() {
      this.formView.abbrInputView.fieldView.value = '';
      this.formView.titleInputView.fieldView.value = '';
      this.formView.element.reset();

      this._balloon.remove(this.formView);

      // Focus the editing view after closing the form view.
      this.editor.editing.view.focus();
   }
}
