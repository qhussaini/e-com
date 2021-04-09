import { Component, OnInit, Input } from "@angular/core";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  @Input() title: string;
  @Input() value: string;
  @Input() icon: string;
  @Input() classNames: string;

  constructor(public theme: ThemeService) {}

  ngOnInit() {}
}
