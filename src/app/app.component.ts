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
  title: any;

  newTask: string;
  
  sendRequest() {

    console.log(this.tasks);
    var oSendBody = {
      title: "hi",
      tasks: this.tasks
    };
    if (this.tasks.length === 0 && this.status === 1) {
      console.log("trying to delete");
      this.http.delete(
        be_url + this.token)
      .subscribe(
        data => {
          console.log("deleted");
          this.router.navigate(['/']);
        }
      )
    } else if (this.status) {
      this.http.put(
        be_url + this.token,
        oSendBody)
      .subscribe(
        data => {
          console.log("here is the data", data);
        }
      )
    } else {
      this.http.post(
        be_url + this.token,
        oSendBody)
      .subscribe(
        data => {
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
    console.log("completed task");
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

  generateQR() {
    console.log("here is the code");
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
    console.log(id);
    this.http.get<Object>(be_url + id).subscribe(
      data => {
        this.token = data["token"];
        this.status = data["status"];
        this.tasks = data["payload"]["tasks"];
        if (!this.status) {
          this.noTodoFound = true;
          this.router.navigate(['/']);
        }
      }
    )
  }

}
