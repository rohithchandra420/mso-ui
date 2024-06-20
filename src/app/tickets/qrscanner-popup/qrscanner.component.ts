import { AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    ScannerQRCodeConfig, ScannerQRCodeResult,
    NgxScannerQrcodeService, NgxScannerQrcodeComponent,
    ScannerQRCodeSelectedFiles
} from 'ngx-scanner-qrcode';

@Component({
    selector: 'qr-scanner',
    templateUrl: './qrscanner.component.html',
    styleUrls: ['./qrscanner.component.css'],
})

export class QrScannerComponent implements AfterViewInit {

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#front_and_back_camera
    public config: ScannerQRCodeConfig = {
        constraints: {
            video: {
                width: window.innerWidth
            },
        },
        // canvasStyles: [
        //   { /* layer */
        //     lineWidth: 1,
        //     fillStyle: '#00950685',
        //     strokeStyle: '#00950685',
        //   },
        //   { /* text */
        //     font: '17px serif',
        //     fillStyle: '#ff0000',
        //     strokeStyle: '#ff0000',
        //   }
        // ],
    };

    public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
    public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];

    @ViewChild('action') action!: NgxScannerQrcodeComponent;

    public percentage = 80;
    public quality = 100;
    validKeys = false;
    paymentId = "";
    orderId = "";
    ticketId = "";

    constructor(private qrcode: NgxScannerQrcodeService,
        public dialogRef: MatDialogRef<QrScannerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string) { }

    ngAfterViewInit(): void {
        this.action.isReady.subscribe((res: any) => {
            // this.handle(this.action, 'start');
        });
    }

    public onEvent(e: ScannerQRCodeResult[], action?: any): void {
        // e && action && action.pause();
        //console.log(e);
        try {
            let data = JSON.parse(e[0].value);
            let keys = Object.keys(data);
            this.validKeys = keys.includes("oid") && keys.includes("pid") && keys.includes("tid");
            if(this.validKeys) {
                this.orderId = data.oid;
                this.paymentId = data.pid;
                this.ticketId = data.tid;
            }
            
        } catch(e) {
            //return false;
        }        
        if(action) {
            action.stop();
        }
    }

    public handle(action: any, fn: string): void {
        const playDeviceFacingBack = (devices: any[]) => {
          // front camera or back camera check here!
          const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
          action.playDevice(device ? device.deviceId : devices[0].deviceId);
        }
    
        if (fn === 'start') {
          action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
        } else {
            this.validKeys = false;
          action[fn]().subscribe((r: any) => console.log(fn, r), alert);
        }
      }
    
      public onDowload(action: NgxScannerQrcodeComponent) {
        action.download().subscribe(console.log, alert);
      }
    
      public onSelects(files: any) {
        this.qrcode.loadFiles(files, this.percentage, this.quality).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
          this.qrCodeResult = res;
        });
      }
    
      public onSelects2(files: any) {
        this.qrcode.loadFilesToScan(files, this.config, this.percentage, this.quality).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
          //console.log(res);
          this.qrCodeResult2 = res;
        });
      }
    
      public onGetConstraints() {
        const constrains = this.action.getConstraints();
        //console.log(constrains);
      }
      
      public applyConstraints() {
        const constrains = this.action.applyConstraints({
          ...this.action.getConstraints(),
          width: 510
        });
        //console.log(constrains);
      }


    onNoClick(): void {
        this.dialogRef.close();
    }

    onCopyId(data) {
        //console.log(data);
    }

}