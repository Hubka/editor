import { Command } from '@ckeditor/ckeditor5-core';
export default class FinanceTableCommand extends Command {
    refresh(): void;
    execute({ abbr, title }: any): void;
}
