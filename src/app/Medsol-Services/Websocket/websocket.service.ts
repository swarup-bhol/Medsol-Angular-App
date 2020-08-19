import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
   SockJs = require("sockjs-client");
   Stomp = require("stompjs"); 
  constructor() {} 

    connect() {
        let socket = new this.SockJs(`http://localhost:8080/ws`);

        let stompClient = this.Stomp.over(socket);

        return stompClient;
    }
}
