import { Plugin } from '@ckeditor/ckeditor5-core';
import { SimpleBoxEditing } from './simple-box-editing';
import { SimpleBoxUI } from './simple-box-ui';

export class SimpleBox extends Plugin {
   static get requires() {
      return [SimpleBoxEditing, SimpleBoxUI];
   }
}
