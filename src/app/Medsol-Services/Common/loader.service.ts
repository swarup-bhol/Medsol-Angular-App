import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  header = new BehaviorSubject<boolean>(true);
  loader = new BehaviorSubject<boolean>(false);
}
