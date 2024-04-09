import { Command, Plugin } from '@ckeditor/ckeditor5-core';
import { ContextualBalloon, ViewModel, addListToDropdown, clickOutsideHandler, createDropdown } from '@ckeditor/ckeditor5-ui';
import { Collection } from '@ckeditor/ckeditor5-utils';
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget';
import { ConfigView } from './config-view';

export class Tag extends Plugin {
   static get requires() {
      return [TagEditing, TagUI];
   }
}

class TagCommand extends Command {
   override execute({ value }: any) {
      const editor = this.editor;
      const selection = editor.model.document.selection;

      editor.model.change((writer) => {
         // Create a <placeholder> element with the "name" attribute (and all the selection attributes)...
         const placeholder = writer.createElement('tag', {
            ...Object.fromEntries(selection.getAttributes()),
            name: value
         });

         // ... and insert it into the document. Put the selection on the inserted element.
         editor.model.insertObject(placeholder, null, null, {
            setSelection: 'on'
         });
      });
   }

   override refresh() {
      const model = this.editor.model;
      const selection: any = model.document.selection;

      const isAllowed = model.schema.checkChild(selection.focus.parent, 'tag');

      this.isEnabled = isAllowed;
   }
}

class TagUI extends Plugin {
   static get requires() {
      return [ContextualBalloon];
   }

   private _balloon: ContextualBalloon | null = null;
   private formView: ConfigView | null = null;

   init() {
      const editor = this.editor;
      const t = editor.t;
      const placeholderNames: any = editor.config.get('placeholderConfig.types');

      // Create the balloon and the form view.
      this._balloon = this.editor.plugins.get(ContextualBalloon);
      this.formView = this._createFormView();

      // The "placeholder" dropdown must be registered among the UI components of the editor
      // to be displayed in the toolbar.
      editor.ui.componentFactory.add('tag', (locale) => {
         const dropdownView = createDropdown(locale);

         // Populate the list in the dropdown with items.
         addListToDropdown(dropdownView, getDropdownItemsDefinitions(placeholderNames) as any);

         dropdownView.buttonView.set({
            // The t() function helps localize the editor. All strings enclosed in t() can be
            // translated and change when the language of the editor changes.
            label: t('Tag'),
            tooltip: true,
            withText: true
         });

         // Disable the placeholder button when the command is disabled.
         const command: any = editor.commands.get('tag');
         dropdownView.bind('isEnabled').to(command);

         // Execute the command when the dropdown item is clicked (executed).
         this.listenTo(dropdownView, 'execute', (evt: any) => {
            editor.execute('tag', { value: evt.source.commandParam });
            editor.editing.view.focus();
         });

         //
         // Show the UI on button click.
         this.listenTo(dropdownView, 'execute', () => {
            this._showUI();
         });

         return dropdownView;
      });
   }

   _createFormView(): ConfigView {
      const editor = this.editor;
      const configView = new ConfigView(editor.locale as any);

      this.listenTo(configView, 'submit', () => {
         const title =
            (configView.titleInputView.fieldView.element instanceof HTMLInputElement &&
               configView.titleInputView.fieldView.element?.value) ||
            '';
         const abbr =
            (configView.abbrInputView.fieldView.element instanceof HTMLInputElement && configView.abbrInputView.fieldView.element?.value) ||
            '';

         editor.model.change((writer) => {
            // editor.model.insertContent(writer.createText(abbr, { abbreviation: title }));
            editor.model.insertContent(writer.createElement('placeholder', { name: title }));
         });

         // Hide the form view after submit.
         this._hideUI();
      });

      this.listenTo(configView, 'cancel', () => {
         this._hideUI();
      });

      // Hide the form view when clicking outside the balloon.

      if (this._balloon) {
         clickOutsideHandler({
            emitter: configView,
            activator: () => this._balloon?.visibleView === configView,
            contextElements: [this._balloon.view.element as any],
            callback: () => this._hideUI()
         });
      }

      return configView;
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
      if (!this._balloon || !this.formView) {
         return;
      }

      this._balloon.add({
         view: this.formView,
         position: this._getBalloonPositionData()
      });

      this.formView.focus();
   }

   _hideUI() {
      if (!this._balloon || !this.formView) {
         return;
      }

      if (this.formView.titleInputView.fieldView.element instanceof HTMLInputElement) {
         this.formView.titleInputView.fieldView.element.value = '';
      }

      if (this.formView.abbrInputView.fieldView.element instanceof HTMLInputElement) {
         this.formView.abbrInputView.fieldView.element.value = '';
      }

      if (this.formView.element instanceof HTMLFormElement) {
         this.formView.element.reset();
      }

      this._balloon.remove(this.formView);

      // Focus the editing view after closing the form view.
      this.editor.editing.view.focus();
   }
}

function getDropdownItemsDefinitions(placeholderNames: any) {
   const itemDefinitions = new Collection();

   for (const name of placeholderNames) {
      const definition = {
         type: 'button',
         model: new ViewModel({
            commandParam: name,
            label: name,
            withText: true
         })
      };

      // Add the item definition to the collection.
      itemDefinitions.add(definition);
   }

   return itemDefinitions;
}

class TagEditing extends Plugin {
   static get requires() {
      return [Widget];
   }

   init() {
      console.log('TagEditing#init() got called');

      this._defineSchema();
      this._defineConverters();

      this.editor.commands.add('tag', new TagCommand(this.editor));

      this.editor.editing.mapper.on(
         'viewToModelPosition',
         viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => viewElement.hasClass('tag'))
      );
      this.editor.config.define('placeholderConfig', {
         types: ['date', 'first name', 'surname']
      });
   }

   _defineSchema() {
      const schema = this.editor.model.schema;

      schema.register('tag', {
         // Behaves like a self-contained inline object (e.g. an inline image)
         // allowed in places where $text is allowed (e.g. in paragraphs).
         // The inline widget can have the same attributes as text (for example linkHref, bold).
         inheritAllFrom: '$inlineObject',

         // The placeholder can have many types, like date, name, surname, etc:
         allowAttributes: ['name']
      });
   }

   _defineConverters() {
      const conversion = this.editor.conversion;

      conversion.for('upcast').elementToElement({
         view: {
            name: 'span',
            classes: ['tag']
         },
         model: (viewElement, { writer: modelWriter }) => {
            // Extract the "name" from "{name}".
            const name = (viewElement as any).getChild(0).data.slice(1, -1);

            return modelWriter.createElement('tag', { name });
         }
      });

      conversion.for('editingDowncast').elementToElement({
         model: 'tag',
         view: (modelItem, { writer: viewWriter }) => {
            const widgetElement = createTagView(modelItem, viewWriter);

            // Enable widget handling on a placeholder element inside the editing view.
            return toWidget(widgetElement, viewWriter);
         }
      });

      conversion.for('dataDowncast').elementToElement({
         model: 'tag',
         view: (modelItem, { writer: viewWriter }) => createTagView(modelItem, viewWriter)
      });

      // Helper method for both downcast converters.
      function createTagView(modelItem: any, viewWriter: any) {
         const name = modelItem.getAttribute('name');

         const placeholderView = viewWriter.createContainerElement('span', {
            class: 'tag'
         });

         // Insert the placeholder name (as a text).
         const innerText = viewWriter.createText('{' + name + '}');
         viewWriter.insert(viewWriter.createPositionAt(placeholderView, 0), innerText);

         return placeholderView;
      }
   }
}
