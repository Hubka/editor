import { Command } from '@ckeditor/ckeditor5-core';
import { findAttributeRange } from '@ckeditor/ckeditor5-typing';
import { toMap } from '@ckeditor/ckeditor5-utils';

export default class FinanceTableCommand extends Command {
   override refresh() {
      const model = this.editor.model;
      const selection = model.document.selection;
      const firstRange = selection.getFirstRange();

      if (firstRange?.isCollapsed) {
         if (selection.hasAttribute('financeTable')) {
            const attributeValue = selection.getAttribute('financeTable');

            // Find the entire range containing the financeTable under the caret position.
            const financeTableRange = findAttributeRange(selection.getFirstPosition() as any, 'financeTable', attributeValue, model);

            this.value = {
               abbr: getRangeText(financeTableRange),
               title: attributeValue,
               range: financeTableRange
            };
         } else {
            this.value = null;
         }
      }
      // When the selection is not collapsed, the command has a value if the selection contains a subset of a single financeTable
      // or an entire financeTable.
      else {
         if (selection.hasAttribute('financeTable')) {
            const attributeValue = selection.getAttribute('financeTable');

            // Find the entire range containing the financeTable under the caret position.
            const financeTableRange = findAttributeRange(selection.getFirstPosition() as any, 'financeTable', attributeValue, model);

            if (financeTableRange.containsRange(firstRange!, true)) {
               this.value = {
                  abbr: getRangeText(firstRange),
                  title: attributeValue,
                  range: firstRange
               };
            } else {
               this.value = null;
            }
         } else {
            this.value = null;
         }
      }

      // The command is enabled when the "financeTable" attribute can be set on the current model selection.
      this.isEnabled = model.schema.checkAttributeInSelection(selection, 'financeTable');
   }

   override execute({ abbr, title }: any) {
      const model = this.editor.model;
      const selection = model.document.selection;

      model.change((writer) => {
         // If selection is collapsed then update the selected financeTable or insert a new one at the place of caret.
         if (selection.isCollapsed) {
            // When a collapsed selection is inside text with the "financeTable" attribute, update its text and title.
            if (this.value) {
               const { end: positionAfter } = model.insertContent(
                  writer.createText(abbr, { financeTable: title }),
                  (this.value as any).range
               );
               // Put the selection at the end of the inserted financeTable.
               writer.setSelection(positionAfter);
            }
            // If the collapsed selection is not in an existing financeTable, insert a text node with the "financeTable" attribute
            // in place of the caret. Because the selection is collapsed, the attribute value will be used as a data for text.
            // If the financeTable is empty, do not do anything.
            else if (abbr !== '') {
               const firstPosition = selection.getFirstPosition();

               // Collect all attributes of the user selection (could be "bold", "italic", etc.)
               const attributes = toMap(selection.getAttributes());

               // Put the new attribute to the map of attributes.
               attributes.set('financeTable', title);

               // Inject the new text node with the financeTable text with all selection attributes.
               const { end: positionAfter } = model.insertContent(writer.createText(abbr, attributes), firstPosition);

               // Put the selection at the end of the inserted financeTable. Using an end of a range returned from
               // insertContent() just in case nodes with the same attributes were merged.
               writer.setSelection(positionAfter);
            }

            // Remove the "financeTable" attribute attribute from the selection. It stops adding a new content into the financeTable
            // if the user starts to type.
            writer.removeSelectionAttribute('financeTable');
         } else {
            // If the selection has non-collapsed ranges, change the attribute on nodes inside those ranges
            // omitting nodes where the "financeTable" attribute is disallowed.
            const ranges = model.schema.getValidRanges(selection.getRanges(), 'financeTable');

            for (const range of ranges) {
               writer.setAttribute('financeTable', title, range);
            }
         }
      });
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
