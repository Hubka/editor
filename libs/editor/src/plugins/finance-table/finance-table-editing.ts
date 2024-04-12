import { Plugin } from '@ckeditor/ckeditor5-core';
import FinanceTableCommand from './finance-table-command';

export default class FinanceTableEditing extends Plugin {
   init() {
      this._defineSchema();
      this._defineConverters();

      this.editor.commands.add('addFinanceTable', new FinanceTableCommand(this.editor));
   }

   _defineSchema() {
      const schema = this.editor.model.schema;

      // Extend the text node's schema to accept the finance-table attribute.
      schema.extend('$text', {
         allowAttributes: ['financeTable']
      });
   }

   _defineConverters() {
      const conversion = this.editor.conversion;

      // Conversion from a model attribute to a view element
      conversion.for('downcast').attributeToElement({
         model: 'financeTable',

         // Callback function provides access to the model attribute value
         // and the DowncastWriter
         view: (modelAttributeValue, conversionApi) => {
            const { writer } = conversionApi;
            return writer.createAttributeElement('abbr', {
               title: modelAttributeValue
            });
         }
      });

      // Conversion from a view element to a model attribute
      conversion.for('upcast').elementToAttribute({
         view: {
            name: 'abbr',
            attributes: ['title']
         },
         model: {
            key: 'financeTable',

            // Callback function provides access to the view element
            value: (viewElement: any) => {
               const title = viewElement.getAttribute('title');

               return title;
            }
         }
      });
   }
}
