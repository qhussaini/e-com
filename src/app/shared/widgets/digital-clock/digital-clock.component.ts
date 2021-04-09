import { Component, Input, OnInit } from "@angular/core";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "sa-digital-clock",
  templateUrl: "./digital-clock.component.html",
  styleUrls: ["./digital-clock.component.scss"],
})
export class DigitalClockComponent implements OnInit {
  @Input() public longClock: boolean;
  @Input() public shortClock: boolean;

  private daysArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  private date = new Date();

  public hour: any;
  public minute: string;
  public second: string;
  public ampm: string;
  public day: string;

  constructor(public theme: ThemeService) {}

  ngOnInit(): void {
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000);

    this.day = this.daysArray[this.date.getDay()];
  }

  private updateDate(date) {
    const hours = date.getHours();
    this.ampm = hours >= 12 ? "PM" : "AM";
    this.hour = hours % 12;
    this.hour = this.hour ? this.hour : 12;
    this.hour = this.hour < 10 ? "0" + this.hour : this.hour;
    const minutes = date.getMinutes();
    this.minute = minutes < 10 ? "0" + minutes : minutes.toString();
    const seconds = date.getSeconds();
    this.second = seconds < 10 ? "0" + seconds : seconds.toString();
  }
}
