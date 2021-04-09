import { Component, OnInit, Input } from "@angular/core";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "app-members",
  templateUrl: "./members.component.html",
  styleUrls: ["./members.component.scss"],
})
export class MembersComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() text: string;
  constructor(public theme: ThemeService) {}

  ngOnInit() {}
}
