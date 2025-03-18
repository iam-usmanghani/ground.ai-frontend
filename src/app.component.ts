import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {

    constructor(private _router: Router){
        let token = localStorage.getItem("accessToken");
        if(!token || token?.length < 15){
            this._router.navigateByUrl('/auth/login');
        }
    }
}
