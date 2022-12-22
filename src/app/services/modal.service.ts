import { Injectable } from '@angular/core';

interface iModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: Array<iModal> = [];
  constructor() {}

  isModalOpen(id: string): boolean {
    return Boolean(this.modals.find((x) => x.id === id)?.visible);
  }

  toggleModal(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal ? (modal.visible = !modal.visible) : null;
  }

  register(id: string) {
    this.modals.push({ id, visible: false });
  }

  unregister(id: string) {
    this.modals = this.modals.filter((x) => x.id !== id);
  }
}
