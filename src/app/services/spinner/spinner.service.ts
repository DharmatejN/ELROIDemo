import { Injectable } from '@angular/core';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { SpinnerComponent } from './spinner.component';

// import { SpinnerOverlayRef } from './spinner-overlay-ref';

interface SpinnerDialogConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    DEFAULT_CONFIG: SpinnerDialogConfig = {
        hasBackdrop: true,
        backdropClass: 'dark-backdrop',
        panelClass: 'tm-file-preview-dialog-panel'
    };

    private overlayRef: OverlayRef;

    constructor(
        private overlay: Overlay
    ) { }

    open(config: SpinnerDialogConfig = {}): void {
        // Override default configuration
        const dialogConfig = { ...this.DEFAULT_CONFIG, ...config };

        // Returns an OverlayRef which is a PortalHost
        this.overlayRef = this.createOverlay(dialogConfig);

        // Instantiate remote control
        // const dialogRef = new SpinnerOverlayRef(this.overlayRef);

        // Create ComponentPortal that can be attached to a PortalHost
        const filePreviewPortal = new ComponentPortal(SpinnerComponent);

        // Attach ComponentPortal to PortalHost
        this.overlayRef.attach(filePreviewPortal);

        // return dialogRef;
    }

    close(): void {
        this.overlayRef.dispose();
    }

    private createOverlay(config: SpinnerDialogConfig) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }

    private getOverlayConfig(config: SpinnerDialogConfig): OverlayConfig {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });

        return overlayConfig;
    }
}
