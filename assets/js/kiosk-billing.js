// Compatibility entry point; no separate billing implementation.
Promise.resolve(TFB.sharedKioskReady).then(()=>ClubKiosk.createBilling(TFB));
