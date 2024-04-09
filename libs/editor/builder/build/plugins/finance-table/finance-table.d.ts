import { Plugin } from '@ckeditor/ckeditor5-core';
import FinanceTableEditing from './finance-table-editing';
import FinanceTableUI from './finance-table-ui';
export default class FinanceTable extends Plugin {
    static get requires(): (typeof FinanceTableEditing | typeof FinanceTableUI)[];
}
