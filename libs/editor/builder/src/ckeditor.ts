/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { DecoupledEditor } from '@ckeditor/ckeditor5-editor-decoupled';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontColor, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { Image, ImageResize, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import { List } from '@ckeditor/ckeditor5-list';
import { Mention } from '@ckeditor/ckeditor5-mention';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { SpecialCharacters } from '@ckeditor/ckeditor5-special-characters';
import { Table, TableCellProperties, TableColumnResize, TableProperties, TableToolbar } from '@ckeditor/ckeditor5-table';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { parentElName } from './plugins/finance-table/constants/names';
import FinanceTable from './plugins/finance-table/finance-table';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends DecoupledEditor {
   public static override builtinPlugins = [
      Alignment,
      Bold,
      Essentials,
      FontColor,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      Image,
      ImageResize,
      ImageToolbar,
      ImageUpload,
      Italic,
      List,
      Mention,
      PageBreak,
      // Pagination,
      Paragraph,
      RemoveFormat,
      // RestrictedEditingMode,
      SpecialCharacters,
      Strikethrough,
      Table,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      // Template,
      Underline,
      Undo,
      FinanceTable
   ];

   public static override defaultConfig: EditorConfig = {
      toolbar: {
         items: [
            'heading',
            '|',
            'fontSize',
            '|',
            'fontColor',
            'highlight',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'removeFormat',
            '|',
            'alignment',
            '|',
            'numberedList',
            'bulletedList',
            '|',
            'imageUpload',
            'insertTable',
            'specialCharacters',
            'horizontalLine',
            '|',
            // 'restrictedEditing',
            'undo',
            'redo',
            parentElName
            // 'pageBreak',
            // 'previousPage',
            // 'pageNavigation',
            // 'nextPage',
            // '|',
            // 'insertTemplate'
         ]
      },
      language: 'en-gb',
      image: {
         toolbar: ['imageTextAlternative']
      },
      table: {
         contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties']
      }
      // pagination: {
      //    pageWidth: '21cm',
      //    pageHeight: '29.7cm',
      //    pageMargins: {
      //       top: '20mm',
      //       bottom: '20mm',
      //       left: '12mm',
      //       right: '12mm'
      //    }
      // }
   };
}

export default Editor;
