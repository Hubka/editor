/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { DecoupledEditor } from '@ckeditor/ckeditor5-editor-decoupled';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontColor, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { Image, ImageResize, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
import { List } from '@ckeditor/ckeditor5-list';
import { Mention } from '@ckeditor/ckeditor5-mention';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { Pagination } from '@ckeditor/ckeditor5-pagination';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { RestrictedEditingMode } from '@ckeditor/ckeditor5-restricted-editing';
import { SpecialCharacters } from '@ckeditor/ckeditor5-special-characters';
import { Table, TableCellProperties, TableColumnResize, TableProperties, TableToolbar } from '@ckeditor/ckeditor5-table';
import { Template } from '@ckeditor/ckeditor5-template';
import { Undo } from '@ckeditor/ckeditor5-undo';
declare class Editor extends DecoupledEditor {
    static builtinPlugins: (typeof Alignment | typeof Bold | typeof Essentials | typeof FontColor | typeof FontSize | typeof Heading | typeof Highlight | typeof HorizontalLine | typeof Image | typeof ImageResize | typeof ImageToolbar | typeof ImageUpload | typeof Italic | typeof List | typeof Mention | typeof PageBreak | typeof Pagination | typeof Paragraph | typeof RemoveFormat | typeof RestrictedEditingMode | typeof SpecialCharacters | typeof Strikethrough | typeof Table | typeof TableCellProperties | typeof TableColumnResize | typeof TableProperties | typeof TableToolbar | typeof Template | typeof Underline | typeof Undo)[];
    static defaultConfig: EditorConfig;
}
export default Editor;
