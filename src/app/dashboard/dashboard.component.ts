import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sourceCars: any[] = [
    { "id": "Open" },
    { "id": "OpenNew", "label": "Open New" },
    { "id": "ZoomIn", "label": "Zoom In" },
    { "id": "ZoomOut", "label": "Zoom Out" },
    { "id": "OriginalView", "label": "Original View" },
    { "id": "Quality" },
    { "id": "Pause" },
    { "id": "Mute" },
    { "id": "ViewSVG", "label": "View SVG" },
    { "id": "ViewSource", "label": "View Source" },
    { "id": "SaveAs", "label": "Save As" },
    { "id": "Help" },
    { "id": "About", "label": "About Adobe CVG Viewer..." }
  ];

  targetCars: any[] = [
    { "id": "Find", "label": "Find..." },
    { "id": "FindAgain", "label": "Find Again" },
    { "id": "Copy" },
    { "id": "CopyAgain", "label": "Copy Again" },
    { "id": "CopySVG", "label": "Copy SVG" },
  ];

  constructor() { }

  ngOnInit() {
  }

}
