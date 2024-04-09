import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CKEditorModule, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { EditorConfig } from '@ckeditor/ckeditor5-core';
import { DocumentEditor } from '@gateway/components/editor';
import { estimateDoc } from './estimate-doc';
import { NxWelcomeComponent } from './nx-welcome.component';
@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, CKEditorModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('toolbar', { static: true }) toolbar!: ElementRef;

  public Editor: any = DocumentEditor;
  public config: EditorConfig = {
    licenseKey: '',
    mention: {
      feeds: [
        {
          marker: '[',
          feed: [
            '[OrderItemReference]',
            '[OrderDate]',
            '[OrderContactEmail]',
            '[OrderContactPhone]',
            '[OrderVehicleManufacturer]',
            '[OrderVehicleModel]',
            '[OrderVehicleVIN]',
            '[OrderVehicleVRN]',
            '[OrderCustomerName]',
            '[OrderCompanyAddress]',
            '[OrderEstimateReference]',
          ],
          minimumCharacters: 0,
        },
      ],
    },
  };

  public content = estimateDoc;

  public editorRef!: DocumentEditor;
  public isEditing = false;

  constructor() {
    console.log('DocumentEditor', DocumentEditor);
  }

  public onReady(editor: DocumentEditor | any): void {
    this.toolbar.nativeElement.appendChild(editor.ui.view.toolbar.element);
    this.editorRef = editor;

    this.startEditing();
  }

  public eventListeners: any[] = [];

  public onChange({ editor }: ChangeEvent<any>): void {
    const data = editor.getData();

    console.log(data);

    this.addListeners(data);
  }

  public onFocus(event: any): void {
    console.log('Focused', event);
  }

  public addListeners(data: any): void {
    // remove all event listeners
    this.eventListeners.forEach(({ el, listener }) =>
      el?.removeEventListener('click', listener),
    );

    document.querySelectorAll('.simple-box').forEach((el) => {
      const listener = () => {
        console.log('Clicked', el);
        const fakeDoc = document.createElement('html');
        fakeDoc.innerHTML = data;

        fakeDoc.querySelectorAll('.simple-box')[0].innerHTML =
          `<h1 class="simple-box-title ck-editor__editable ck-editor__nested-editable" role="textbox" contenteditable="true">MIKE</h1><div class="simple-box-description ck-editor__editable ck-editor__nested-editable" role="textbox" contenteditable="true"><p><br data-cke-filler="true"></p></div>`;

        console.log('Content', fakeDoc.innerHTML);
        console.log('------');

        this.content = fakeDoc.innerHTML;
      };
      this.eventListeners.push({ el, listener });

      el.addEventListener('click', listener);
    });
  }

  public startEditing(): void {
    if (!this.isEditing) {
      this.editorRef.disableReadOnlyMode('mike');
      this.isEditing = true;
    } else {
      this.editorRef.enableReadOnlyMode('mike');
      this.isEditing = false;
    }
  }
}
