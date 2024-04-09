import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView, clickOutsideHandler, ContextualBalloon } from '@ckeditor/ckeditor5-ui';
import './settings/styles.css';
import FormView from './settings/tag-settings-view';

function findAncestor(parentName: any, positionOrElement: any) {
   let parent = positionOrElement.parent;

   while (parent) {
      if (parent.name === parentName) {
         return parent;
      }

      parent = parent.parent;
   }
}

export default class SimpleBoxUI extends Plugin {
   _balloon: any;
   formView: any;

   init() {
      console.log('SimpleBoxUI#init() got called');

      const editor = this.editor;
      const t = editor.t;

      editor.model.schema.extend('paragraph', { allowAttributes: ['class'] });
      editor.conversion.attributeToAttribute({ model: 'class', view: 'class' });

      // Create the balloon and the form view.
      this._balloon = this.editor.plugins.get(ContextualBalloon);
      this.formView = this._createFormView();

      // The "simpleBox" button must be registered among the UI components of the editor
      // to be displayed in the toolbar.
      editor.ui.componentFactory.add('simpleBox', (locale) => {
         // The state of the button will be bound to the widget command.
         const command: any = editor.commands.get('insertSimpleBox');

         // The button will be an instance of ButtonView.
         const buttonView = new ButtonView(locale);

         buttonView.set({
            // The t() function helps localize the editor. All strings enclosed in t() can be
            // translated and change when the language of the editor changes.
            label: t('Simple Box'),
            withText: true,
            tooltip: true
         });

         // Bind the state of the button to the command.
         buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

         // Execute the command when the button is clicked (executed).
         this.listenTo(buttonView, 'execute', () => {
            editor.execute('insertSimpleBox');
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
      const formView = new FormView(editor.locale);

      this.listenTo(formView, 'submit', () => {
         const title = (formView.titleInputView as any).fieldView.element.value;
         const abbr = (formView.abbrInputView as any).fieldView.element.value;

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
               writer.setAttribute('class', 'mike-test', selectedElement);
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
