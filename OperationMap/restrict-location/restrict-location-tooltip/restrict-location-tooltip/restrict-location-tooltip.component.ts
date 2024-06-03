import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'kt-restrict-location-tooltip',
  templateUrl: './restrict-location-tooltip.component.html',
  styleUrls: ['./restrict-location-tooltip.component.scss']
})
export class RestrictLocationTooltipComponent  {

  @Input() text: string;
  @Input() content: TemplateRef<any>;

}
