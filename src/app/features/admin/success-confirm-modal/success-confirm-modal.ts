import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ButtonDirective } from '@shared/components/button/button.directive';
import { ModalShellComponent } from '@shared/ui/modal-shell/modal-shell.component';

export type AdminAction = 'created' | 'updated' | 'deleted';

export interface SuccessConfirmModalData {
  action: AdminAction;
  productTitle: string;
}

const ACTION_TITLES: Record<AdminAction, string> = {
  created: 'Product added',
  updated: 'Product updated',
  deleted: 'Product deleted',
};

const ACTION_MESSAGES: Record<AdminAction, string> = {
  created: 'was added successfully.',
  updated: 'was updated successfully.',
  deleted: 'was deleted successfully.',
};

@Component({
  selector: 'app-success-confirm-modal',
  imports: [ModalShellComponent, ButtonDirective],
  templateUrl: './success-confirm-modal.html',
})
export class SuccessConfirmModal {
  private readonly dialogRef = inject<DialogRef<void>>(DialogRef);

  protected readonly data = inject<SuccessConfirmModalData>(DIALOG_DATA);
  protected readonly modalTitle = ACTION_TITLES[this.data.action];
  protected readonly message = ACTION_MESSAGES[this.data.action];

  protected onClose(): void {
    this.dialogRef.close();
  }
}
