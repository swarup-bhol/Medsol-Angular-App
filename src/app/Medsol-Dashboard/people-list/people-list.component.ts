import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  peopleList:number[];
  constructor() { }

  ngOnInit() {
    this.peopleList = [1,2,3,4,5,6,7,8];
  }

}
