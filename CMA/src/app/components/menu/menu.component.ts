import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { auth_class } from 'src/app/graphs_class/auth_class';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { finalizeService } from 'src/app/service/finalize.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
   @Output() option: EventEmitter<number> = new EventEmitter();
   public authClass = new auth_class(this.router, this.authService, this.alertService);
    constructor(private finalizeService: finalizeService,
      private router: Router,
      private authService: AuthService,
      private alertService: AlertService,
    ){
      this.authClass.validateUser();
    }

   change_option_event(option: number){
    if(option == 6){
          this.router.navigate(['/login']);
    }else{
      this.finalizeService.finalizeAllPolling_Event();
      this.option.emit(option);
      this.authClass.validateUser();

    }
   }
}
