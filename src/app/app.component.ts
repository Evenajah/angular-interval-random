import { Component } from '@angular/core';
import {
  BehaviorSubject,
  finalize,
  interval,
  Subject,
  switchMap,
  timer,
} from 'rxjs';
import { exhaustMap, map, scan, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  interval = new BehaviorSubject<number>(Math.floor(Math.random() * 11) * 1000);
  destroy = new Subject<void>();
  ngOnInit() {
    const eiei = this.interval.pipe(
      scan((total, res) => {
        return total + 1;
      }, 0),
      switchMap(() => {
        return timer(this.interval.getValue()).pipe(
          map((res) => {
            return {
              count: res,
              interval: this.interval.getValue(),
            };
          })
        );
      }),
      takeUntil(this.destroy)
    );

    eiei.subscribe((res) => {
      console.log(res);
      this.interval.next(Math.floor(Math.random() * 11) * 1000);
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
