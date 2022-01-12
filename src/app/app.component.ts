import { Component } from '@angular/core';
import { BehaviorSubject, finalize, interval, Subject, switchMap } from 'rxjs';
import { exhaustMap, scan, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  interval = new BehaviorSubject<number>(Math.floor(Math.random() * 11) * 1000);
  destroy = new Subject<void>();
  ngOnInit() {
    this.interval
      .pipe(
        scan((total, res) => {
          return { res: res, total: total + 1 };
        }, 0),
        switchMap((res) => {
          console.log(res.total);
          console.log('random : ' + res.res / 1000);
          return interval(res.res);
        }),
        takeUntil(this.destroy)
      )
      .subscribe(() => {
        this.interval.next(Math.floor(Math.random() * 11) * 1000);
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
