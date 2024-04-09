import { Plugin } from '@ckeditor/ckeditor5-core';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';
import { insertCommandName, parentElName } from './constants/names';
import InsertFinanceTableCommand from './finance-table-insert-command';

export default class FinanceTableEditing extends Plugin {
  isContextPlugin = true;

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add(
      insertCommandName,
      new InsertFinanceTableCommand(this.editor),
    );
  }

  _defineSchema() {
    // ADDED
    const schema = this.editor.model.schema;

    schema.register(parentElName, {
      // Behaves like a self-contained block object (e.g. a block image)
      // allowed in places where other blocks are allowed (e.g. directly in the root).
      inheritAllFrom: '$blockObject',
      isInline: true,
    });

    schema.register('simpleBoxTitle', {
      // Cannot be split or left by the caret.
      isLimit: true,

      allowIn: parentElName,

      // Allow content which is allowed in blocks (i.e. text with attributes).
      allowContentOf: '$block',
    });

    schema.register('simpleBoxDescription', {
      // Cannot be split or left by the caret.
      isLimit: true,

      allowIn: parentElName,

      // Allow content which is allowed in the root (e.g. paragraphs).
      allowContentOf: '$root',
    });

    schema.addChildCheck((context, childDefinition) => {
      if (
        context.endsWith('simpleBoxDescription') &&
        childDefinition.name == parentElName
      ) {
        return false;
      }
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    // <simpleBox> converters.
    conversion.for('upcast').elementToElement({
      model: parentElName,
      view: {
        name: 'section',
        classes: 'simple-box',
      },
    });
    conversion.for('dataDowncast').elementToElement({
      model: parentElName,
      view: {
        name: 'section',
        classes: 'simple-box',
      },
    });
    conversion.for('editingDowncast').elementToElement({
      model: parentElName,
      view: (modelElement, { writer: viewWriter }) => {
        const section = viewWriter.createContainerElement('section', {
          class: 'simple-box',
        });

        return toWidget(section, viewWriter, { label: 'simple box widget' });
      },
    });

    // <simpleBoxTitle> converters.
    conversion.for('upcast').elementToElement({
      model: 'simpleBoxTitle',
      view: {
        name: 'h1',
        classes: 'simple-box-title',
      },
    });
    conversion.for('dataDowncast').elementToElement({
      model: 'simpleBoxTitle',
      view: {
        name: 'h1',
        classes: 'simple-box-title',
      },
    });
    conversion.for('editingDowncast').elementToElement({
      model: 'simpleBoxTitle',
      view: (modelElement, { writer: viewWriter }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const h1 = viewWriter.createEditableElement('h1', {
          class: 'simple-box-title',
        });

        return toWidgetEditable(h1, viewWriter);
      },
    });

    // <simpleBoxDescription> converters.
    conversion.for('upcast').elementToElement({
      model: 'simpleBoxDescription',
      view: {
        name: 'div',
        classes: 'simple-box-description',
      },
    });
    conversion.for('dataDowncast').elementToElement({
      model: 'simpleBoxDescription',
      view: {
        name: 'div',
        classes: 'simple-box-description',
      },
    });
    conversion.for('editingDowncast').elementToElement({
      model: 'simpleBoxDescription',
      view: (modelElement, { writer: viewWriter }) => {
        // Note: You use a more specialized createEditableElement() method here.
        const div = viewWriter.createEditableElement('div', {
          class: 'simple-box-description',
        });

        return toWidgetEditable(div, viewWriter);
      },
    });
  }
}
