import { Component, input, output } from '@angular/core';
import { ButtonDirective } from '../../components/button/button.directive';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [ButtonDirective],
  templateUrl: './modal-shell.component.html',
})
export class ModalShellComponent {
  readonly title = input.required<string>();
  readonly showCloseButton = input<boolean>(true);

  readonly closed = output<void>();
}
