import { Plugin } from '@ckeditor/ckeditor5-core';
import SimpleBoxEditing from './tag-editing';
import SimpleBoxUI from './tag-ui';

export default class SimpleBox extends Plugin {
   static get requires() {
      return [SimpleBoxEditing, SimpleBoxUI];
   }
}
