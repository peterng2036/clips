import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import IClip from 'src/app/models/clip.models';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updaing clip';

  clipID = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) return;

    this.clipID.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);

    this.inSubmission = false;
    this.showAlert = false;
  }

  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnDestroy(): void {
    this.modalService.unregister('editClip');
  }

  async submit() {
    if (!this.activeClip) return;

    this.inSubmission = this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updaing clip';

    try {
      await this.clipService.updateClicp(this.clipID.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success !w';
  }
}
