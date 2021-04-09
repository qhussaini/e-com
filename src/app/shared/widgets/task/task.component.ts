import { Component, OnInit, Input } from "@angular/core";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
  @Input() title: string;
  @Input() text: string;
  @Input() id: number;
  constructor(public theme: ThemeService) {}

  ngOnInit() {}
}
