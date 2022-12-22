import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import IClip from 'src/app/models/clip.models';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipServer: ClipService,
    private modalService: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipServer.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    // this.router.navigateByUrl(`/manage?sort=${value}`);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modalService.toggleModal('editClip');
  }

  update($event: IClip) {
    let clip = this.clips.find((x) => x.docID === $event.docID);
    if (clip) {
      clip.fileName = $event.fileName;
    }
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    this.clipServer.deleteClip(clip);

    const index = this.clips.indexOf(clip);
    index && this.clips.splice(index, 1);
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event.preventDefault();
    if (!docID) return;

    const url = `${location.origin}/clip/${docID}`;

    await navigator.clipboard.writeText(url);

    alert('Link Copied!');
  }
}
