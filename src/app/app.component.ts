import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

//let be_url = "http://localhost:5000/";
let be_url = 'https://glacial-bayou-18186.herokuapp.com/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: any[] = [];
  status: any;
  token: any;
  noTodoFound: any;
  title: string = "Untitled <rename me>";
  qrLink: string = "https://api.qrserver.com/v1/create-qr-code/?data=www.4getlists.xyz&amp;size=100x100";

  newTask: string;
  
  getQrCodeUrl(link) {
    if (link === undefined) {
      var sLink = "https://api.qrserver.com/v1/create-qr-code/?data=www.4getlists.xyz&amp;size=100x100";
    } else {
      var sLink = "https://api.qrserver.com/v1/create-qr-code/?data=www.4getlists.xyz/?id=" + link + "&amp;size=100x100";
    }
    return sLink;
  }

  sendRequest() {

    var oSendBody = {
      title: this.title,
      tasks: this.tasks
    };
    if (this.tasks.length === 0 && this.status === 1) {
      this.http.delete(
        be_url + this.token)
      .subscribe(
        data => {
          this.qrLink = this.getQrCodeUrl(undefined);
          this.router.navigate(['/']);
        }
      )
    } else if (this.status) {
      this.http.put(
        be_url + this.token,
        oSendBody)
      .subscribe(
        data => {
          //console.log("here is the data", data); Can replace with message if needed
        }
      )
    } else {
      this.http.post(
        be_url + this.token,
        oSendBody)
      .subscribe(
        data => {
          this.qrLink = this.getQrCodeUrl(this.token);
          this.router.navigate(['/'], {queryParams: { 'id': this.token }});
        }
      )
    }
  }

  addTask(newTask) {
    this.noTodoFound = false;
    if (newTask.length !== 0 && this.tasks.length < 11) {
      var oTask = {};
      oTask["completed"] = false;
      oTask["description"] = newTask;
      this.tasks.push(oTask);
      this.sendRequest();
    }
  }

  completeTask(task) {
    task.completed = !task.completed;
    this.sendRequest();
  }

  removeTask(task) {
    var index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
      this.sendRequest();
    }
  }

  titleChanged(title) {
    if(title.length === 0) {
      this.title = "Untitled <rename me>";
    }
    if (this.tasks.length !== 0) {
      this.sendRequest();
    }
  }

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router) {
    this.newTask = '';
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        let id = params['id'];
        if (id !== undefined) {
          this.getData(id);
        } else {
          this.tasks = [];
          this.getToken();
        }
        
      });
  }

  getToken() {
    this.http.get<Object>(be_url).subscribe(
      data => {
        this.token = data["token"];
        this.status = data["status"];
      }
    )
  }

  getData(id) {
    this.http.get<Object>(be_url + id).subscribe(
      data => {
        try {
          if (!data["success"]) {
            throw new Error("Could not find that todo list.");
          } 
          this.token = data["token"];
          this.status = data["status"];
          this.title = data["payload"]["title"];
          this.tasks = data["payload"]["tasks"];
          this.qrLink = this.getQrCodeUrl(this.token);
          if (!this.status) {
            this.noTodoFound = true;
            this.qrLink = this.getQrCodeUrl(undefined);
            this.router.navigate(['/']);
          }
        } catch (e) {
          console.log(e.message);
          this.noTodoFound = true;
          this.qrLink = this.getQrCodeUrl(undefined);
          this.router.navigate(['/']);
        }
        
      }
    , e => {
        console.log("Could not find that todo list B");
        this.noTodoFound = true;
        this.qrLink = this.getQrCodeUrl(undefined);
        this.router.navigate(['/']);
    });
  }

}
