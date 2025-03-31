import { Component } from '@angular/core';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-admin-export',
  templateUrl: './admin-export.component.html',
  styleUrls: ['./admin-export.component.css']
})
export class AdminExportComponent {

  constructor(private exportService: ExportService) { }

  exportPDF(): void {
    this.exportService.exportTowingsPDF().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'towings.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error("Export PDF failed", error);
    });
  }
}
